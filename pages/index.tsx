import Head from 'next/head'

import { sanityClient } from '../sanity';

import Header from '../components/Header'
import Hero from '../components/Hero';
import PostPreview from '../components/PostPreview';

import { Post } from '../typings';
interface Props {
  posts: [Post]
}

// SSR
export default function Home({ posts }: Props) {
  const Posts = posts.map((post) => {
    const link = `/post/${post.slug.current}`;
    return <PostPreview
      slug={link}
      title={post.title}
      authorName={post.author.name}
      description={post.description}
      imgRef={post.mainImage.asset._ref}
      authorImgRef={post.author.image.asset._ref}
    />
  });

  return (
    <div className="mx-auto">
      <Head>
        <title>Simple Blog Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Hero />
        <section aria-describedby="posts" className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
          {Posts}
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps = async () => {
  // Select all posts
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name, 
      image
    },
    slug,
    description,
    mainImage,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}

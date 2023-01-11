import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity';
import Link from 'next/link';

import { Post } from '../typings';
interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {

  return (
    <div className="mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className='flex justify-around items-center w-full  bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>Stay curious.</h1>
          <h2>Discover stories, thinking, and expertise from writers on any topic.</h2>
          <button className='bg-black rounded-full text-white px-8 py-2'>Start reading</button>
        </div>
        <img className='hidden md:inline-flex h-32 lg:h-full' src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="Medium Logo" />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
        {posts.map((post) => {
          return <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border rounded-lg overflow-hidden h-96'>
              <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duraction-200 ease-in-out' src={urlFor(post.mainImage.asset._ref).url()} alt="Post" />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>{post.description} by {post.author.name}</p>
                </div>
                <img className='h-12 w-12 rounded-full object-cover' src={urlFor(post.author.image.asset._ref).url()} alt="Author" />
              </div>
            </div>
          </Link>
        })}
      </div>


    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name, 
      image
    },
    slug,
    description,
    mainImage
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}
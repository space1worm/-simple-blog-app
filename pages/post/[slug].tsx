import { GetStaticProps } from 'next'

import Header from '../../components/Header'
import PostCover from '../../components/PostCover';
import Article from '../../components/Article';
import CommentForm from '../../components/CommentForm';
import Comments from '../../components/Comments';

import { sanityClient } from '../../sanity'
import { Post } from '../../typings'

interface Props {
    post: Post
}

// SSG
export default function PostPage({ post }: Props) {
    return (
        <main>
            <Header />
            <PostCover imgRef={post.mainImage.asset._ref} />
            <Article
                title={post.title}
                description={post.description}
                authorImgRef={post.author.image.asset._ref}
                authorName={post.author.name}
                createdAt={post._createdAt}
                body={post.body}
            />
            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
            <CommentForm postId={post._id} />
            <Comments comments={post.comments} />
        </main>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
      }`

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => {
        return {
            params: {
                slug: post.slug.current
            }
        }
    });

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
            _id,
            _createdAt,
            title,
            author -> {
                name,
                image
            },
            'comments': *[
                _type == 'comment' &&
                post._ref == ^._id &&
                approved == true
            ],
            description,
            mainImage,
            slug,
            body
        }`;

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    });

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post
        },
        revalidate: 60 // after 60 seconds it'll update the old cache version
    }
}
import { GetStaticProps } from 'next'
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";

import Header from '../../components/Header'
import Article from '../../components/Article';
import Comments from '../../components/Comments';

import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}
interface Props {
    post: Post
}

// SSG
export default function PostPage({ post }: Props) {
    const [submited, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            setSubmitted(true);
        }).catch(err => {
            setSubmitted(false);
            console.log(err)
        });
    };

    return (
        <main>
            <Header />
            <div className='mx-auto max-w-3xl mt-2'>
                <img className='w-full h-60 object-center ' src={urlFor(post.mainImage.asset._ref).url()} alt="" />
            </div>

            <Article
                title={post.title}
                description={post.description}
                authorImgRef={post.author.image.asset._ref}
                authorName={post.author.name}
                createdAt={post._createdAt}
                body={post.body}
            />

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

            {submited ? (
                <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                    <h3 className='text-3xl font-bold'>Thank you for submitting your comment</h3>
                    <p>Once it has been approved it will appear below!</p>
                </div>
            ) :
                (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col p-5 my-10 max-w-3xl mx-auto mb-10'
                    >
                        {/* for tracking post id */}
                        <input
                            {...register("_id")}
                            type="hidden"
                            name="_id"
                            value={post._id}
                        />

                        <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
                        <h4 className='text 3xl font-bold'>Enjoyed this article?</h4>
                        <hr className='py-3 mt-2' />

                        <label className='block mb-5'>
                            <span className='text-gray-700'>Name</span>
                            <input
                                {...register("name", { required: true })}
                                className='shadow border rounded py-2 px-3 form-input block w-full mt-1 ring-yellow-500'
                                placeholder="John Appleseed"
                                type="text" />
                        </label>
                        <label className='block mb-5'>
                            <span className='text-gray-700'>Email</span>
                            <input
                                {...register("email", { required: true })}
                                className='shadow border rounded py-2 px-3 form-input block w-full mt-1 ring-yellow-500'
                                placeholder="John Appleseed"
                                type="email" />
                        </label>
                        <label className='block mb-5'>
                            <span className='text-gray-700'>Comment</span>
                            <textarea
                                {...register("comment", { required: true })}
                                className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring'
                                rows={8} />
                        </label>

                        <div className='flex flex-col p-5'>
                            {errors.name && <span className='text-red-500'>The name field is required</span>}
                            {errors.email && <span className='text-red-500'>The email field is required</span>}
                            {errors.comment && <span className='text-red-500'>The comment field is required</span>}
                        </div>

                        <button className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' type='submit'>Submit</button>
                    </form>
                )}
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
import { GetStaticProps } from 'next'
import { useForm, SubmitHandler } from "react-hook-form";

import Header from '../../components/Header'

import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

import PortableText from 'react-portable-text';

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post
}

export default function PostPage({ post }: Props) {
    console.log(post._id);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data)
        }).catch(err => console.log(err));
    };

    return (
        <main>
            <Header />
            <img className='w-full h-60 object-center ' src={urlFor(post.mainImage.asset._ref).url()} alt="" />

            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>

                <div className='flex items-center space-x-4'>
                    <img className='h-10 w-10 rounded-full object-cover' src={urlFor(post.author.image.asset._ref).url()} alt="Author" />
                    <p className='font-extralight text-sm'>
                        Blog post by <span className='font-bold text-yellow-400'>{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}
                    </p>
                </div>

                <div className='mt-10'>
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        content={post.body}
                        serializers={
                            {
                                h1: ({ children }: any) => {
                                    return <h1 className='text-2xl font-bold my-5'>{children}</h1>
                                },
                                h2: ({ children }: any) => {
                                    return <h2 className='text-xl font-bold my-5'>{children}</h2>
                                },
                                li: ({ children }: any) => {
                                    return <li className="ml-4 list-disc">
                                        {children}
                                    </li>
                                },
                                link: ({ href, children }: any) => {
                                    return <a href={href} className="text-blue-500 hover:underline">
                                        {children}
                                    </a>
                                },
                            }
                        }
                    />
                </div>

            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />


            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col p-5 my-10 max-w-3xl mx-auto mb-10'
            >

                <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
                <h4 className='text 3xl font-bold'>Enjoyed this article?</h4>
                <hr className='py-3 mt-2' />

                <input
                    {...register("_id")}
                    type="hidden"
                    name="_id"
                    value={post._id}
                />

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
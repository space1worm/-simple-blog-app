import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { LoadingStates } from "../app.types";

interface FormInputs {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    postId: string;
}

export default function CommentForm({ postId }: Props) {
    const [submited, setSubmitted] = useState<LoadingStates>('idle');
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setSubmitted('pending');
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            setSubmitted('succeeded');
        }).catch(err => {
            setSubmitted('failed');
            console.log(err)
        });
    };

    return submited === 'succeeded' ?
        (
            <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                <h3 className='text-3xl font-bold'>Thank you for submitting your comment</h3>
                <p>Once it has been approved it will appear below!</p>
            </div>
        ) : (<form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col p-5 my-10 max-w-3xl mx-auto mb-10'
        >
            {/* for tracking post id */}
            <input
                {...register("_id")}
                type="hidden"
                name="_id"
                value={postId}
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
        </form>)
}

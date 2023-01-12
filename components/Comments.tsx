import { Comment } from "../typings"

interface Props {
    comments: Comment[];
}

export default function Comments({ comments }: Props) {
    const Comments = comments.map((comment) => {
        return <div key={comment._id}>
            <p>
                <span className='text-yellow-500'>{comment.name}</span>:<span>{comment.comment}</span>
            </p>
        </div>
    });

    return <section aria-describedby="comments" className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
        <h3 className='text=4xl'>Comments</h3>
        <hr className='pb-2' />
        {Comments}
    </section>
}

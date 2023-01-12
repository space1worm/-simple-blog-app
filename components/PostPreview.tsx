import Link from "next/link";

import { urlFor } from "../sanity";

interface Props {
    slug: string;
    title: string;
    description: string;
    authorName: string;
    imgRef: string;
    authorImgRef: string;
}

export default function PostPreview(props: Props) {
    const { slug, title, description, authorName, imgRef, authorImgRef } = props;

    return <Link href={slug}>
        <div className='group cursor-pointer border rounded-lg overflow-hidden h-96'>
            <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duraction-200 ease-in-out' src={urlFor(imgRef).url()} alt="Post" />
            <div className='flex justify-between p-5 bg-white'>
                <div>
                    <p className='text-lg font-bold'>{title}</p>
                    <p className='text-xs'>{description} by {authorName}</p>
                </div>
                <img className='h-12 w-12 rounded-full object-cover' src={urlFor(authorImgRef).url()} alt="Author" />
            </div>
        </div>
    </Link>
}

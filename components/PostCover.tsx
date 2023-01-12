import { urlFor } from "../sanity";

interface Props {
    imgRef: string;
}

export default function PostCover({ imgRef }: Props) {
    return <div className='mx-auto max-w-3xl mt-2'>
        <img className='w-full h-60 object-center ' src={urlFor(imgRef).url()} alt="" />
    </div>
}

export function Title(props){

    return (
        <div className='mb-6'>
            <h1 className='text-3xl font-fancy text-center'>
                {props.title}
            </h1>
            <img className='w-full h-1 opacity-40' src='/bottom_line.svg' alt='' />
        </div>
    )
}
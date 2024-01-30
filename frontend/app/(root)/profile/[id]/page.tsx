export default function UserProfile({ params }: { params: { name: string } }) {      
    return (
        <div>
            <h1 className='text-4xl'>User Profile: {params.name}</h1>
        </div>
    );
}
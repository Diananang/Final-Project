import { useParams } from "react-router-dom"

export default function DetailDestinationPage(){
    const {id} = useParams();

    return (
        <div>
            <h1>Detail DEstination Page</h1>
        </div>
    )
}
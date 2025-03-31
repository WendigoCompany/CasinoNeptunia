import { HandleResult_PPT } from "./Functions"

export default function PPT() {


    return <div>
        <button onClick={() => { HandleResult_PPT(0) }}>Piedra</button>
        <button onClick={() => { HandleResult_PPT(1) }}>Papel</button>
        <button onClick={() => { HandleResult_PPT(2) }}>Tijera</button>

    </div>
}
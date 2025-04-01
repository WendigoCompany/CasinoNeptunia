import "./Style.css"
import mat from "../../Assets/Backgrounds/Mesa.png"

export function PlayMat ({children}){
    return <div className="play-mat bim pabs" style={{"background-image": `url('${mat}')`}}>
        {children}
    </div>
}


export function Waifu ({children}){
    return <div className="waifu-stand pabs">
            {children}
    </div>
}
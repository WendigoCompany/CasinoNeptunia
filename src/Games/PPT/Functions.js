import random from "../random";

const debug = (e) => {
    switch (e) {
        case 0:
            return "[Piedra]"
        case 1:
            return "[Papel]"
        case 2:
            return "[Tijera]"

    }
}

const Evaluate_PPT = (USER) => {
    const CPU = Determinate_PPT();

    switch (USER) {
        case 0:
            if (CPU == 1) {
                return "D"
            } else if (CPU == 2) {
                return "V"
            } else {
                return "E"
            }
        case 1:
            if (CPU == 0) {
                return "V"
            } else if (CPU == 2) {
                return "D"
            } else {
                return "E"
            }

        case 2:
            if (CPU == 0) {
                return "D"
            } else if (CPU == 1) {
                return "V"
            } else {
                return "E"
            }


    }
}

export const HandleResult_PPT = (USER) => {
    const result = Evaluate_PPT(USER);
    switch (result) {
        case 'V':

            break;

        case 'E':

            break;

        case 'D':

            break;

    }

}

const Determinate_PPT = () => {
    let n = 1;
    for (let i = 0; i < 50; i++) {
        n = random(3)

    }
    return n
}



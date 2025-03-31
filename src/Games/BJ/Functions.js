import Cards_Assets from "../Card_Assets";
import random from "../random";

let DECK = []
let ORIGINAL_DECK = []

export const Restart_Deck = () => {

    DECK = ORIGINAL_DECK


}

 
export const Shuffle_Deck = () => {
    const shuffled = [];

    const SELECT_INDEX = () => {
        let n = 0;
        for (let i = 0; i < 300; i++) {
            n = random(ORIGINAL_DECK.length);

        }
        return n
    }

    for (let i = 0; i < DECK.length; i++) {
        let k = 0;
        do {
            const index = SELECT_INDEX();

            if (shuffled[index] == undefined) {
                shuffled[index] = DECK[i];
                break;
            }


        } while (true);

    }

    DECK = shuffled
    ORIGINAL_DECK = shuffled
}

export const Get_Deck = () => {
    return DECK
}


export const Set_Deck = (NDECK) => {
    DECK = NDECK
}


if (ORIGINAL_DECK.length == 0) {
    for (let i = 0; i < 10; i++) {
        ORIGINAL_DECK.push({
            val: i + 1,
            palo: 'C',
            img: Cards_Assets["coraz"][i],
        })

        ORIGINAL_DECK.push({
            val: i + 1,
            palo: 'T',
            img: Cards_Assets["trebol"][i],
        })
        ORIGINAL_DECK.push({
            val: i + 1,
            palo: 'D',
            img: Cards_Assets["diamante"][i],
        })
        ORIGINAL_DECK.push({
            val: i + 1,
            palo: 'P',
            img: Cards_Assets["pica"][i],
        })

    }

}
import { countRepeat, SortMayor, SortMenor } from "../../Tools/tools";
import { PlayMat, Waifu } from "../Assets/Components";
import Cards_Assets from "../Card_Assets"
import { Back_to_Menu, Help_Menu } from "../Generic_Funcions";
import random from "../random"

export default function Poker() {



    //MANOS
    let USER_HAND = [];
    let CPU_HAND = [];
    //MANOS

    let TURN = 'user';

    //VALOR DE LAS MANOS   
    let USER_VALUE = 0;
    let CPU_VALUE = 0;
    //VALOR DE LAS MANOS

    //CARTAS
    let DECK = []
    let ORIGINAL_DECK = []
    let CHANGED = false
    //CARTAS

    //BET
    let BET = 0;
    //BET

    let cartsToReturn = []


    const Scale = [
        {
            name: 'High Card', vali: (HAND) => {



                // let RV = Raw_Values(HAND);
                // if (RV.indexOf(1) != -1) {
                //     return { bool: true, scalevalue: 14, scalename: 'High Card - AS', id: 0 };
                // } else {
                //     RV = RV.sort()

                //     return { bool: true, scalevalue: RV[0], scalename: 'High Card -' + specialValues(RV[0]), id: 0 };

                // }
                let RV = SortMayor(ReplaceAs(Raw_Values(HAND)));

                return { bool: true, scalevalue: (RV[0]), scalename: 'High Card -' + specialValues(RV[0]), id: 0 };

            }, id: 0
        },
        {
            name: 'One Pair', vali: (HAND) => {

                let card_repeated = false;
                let toDiscart = [];
                let RV = SortMenor(ReplaceAs(Raw_Values(HAND)));

                for (let i = 0; i < RV.length; i++) {
                    if (countRepeat(RV, RV[i]) == 2) {
                        card_repeated = RV[i]
                    } else {
                        toDiscart.push(RV[i])

                    }




                }



                if (card_repeated) {


                    return { bool: true, scalevalue: card_repeated, scalename: 'Pair of -' + specialValues(card_repeated), id: 1, extra: toDiscart };

                } else {
                    return { bool: false };

                }

            }, id: 1
        },
        {
            name: 'Two Pair', vali: (HAND) => {
                let card_repeated = [];
                let toDiscart = [];
                let RV = SortMenor(ReplaceAs(Raw_Values(HAND)));

                const noRepeat = () => {
                    if (card_repeated.length == 4) {
                        return [card_repeated[0], card_repeated[2]]
                    }
                    return []

                }

                for (let i = 0; i < RV.length; i++) {
                    if (countRepeat(RV, RV[i]) == 2) {
                        card_repeated.push(RV[i])
                    } else {
                        toDiscart.push(RV[i])
                    }

                }
                card_repeated = noRepeat(SortMenor(card_repeated))
                if (card_repeated.length == 2) {
                    return { bool: true, scalevalue: card_repeated.toString().replace(",", "-"), scalename: 'Double Pair - ' + `${specialValues(card_repeated[0])} and ${specialValues(card_repeated[1])}`, id: 2, extra: toDiscart };
                } else {
                    return { bool: false };
                }

            }, id: 2
        },
        {
            name: 'Trio', vali: (HAND) => {
                let card_repeated = false;
                let toDiscart = [];
                let RV = SortMenor(ReplaceAs(Raw_Values(HAND)));

                for (let i = 0; i < RV.length; i++) {
                    if (countRepeat(RV, RV[i]) == 3) {
                        card_repeated = RV[i]
                    } else {
                        toDiscart.push(RV[i])
                    }

                }

                if (card_repeated) {
                    return { bool: true, scalevalue: card_repeated, scalename: 'Trio of -' + specialValues(card_repeated), id: 3 };

                } else {
                    return { bool: false };

                }
            }, id: 3
        },
        {
            name: 'Straight', vali: (HAND) => {
                let RV1 = SortMenor(Raw_Values(HAND));
                let RV2 = SortMenor(ReplaceAs(Raw_Values(HAND)));
                let RV1_min = RV1[0];
                let RV2_min = RV2[0];
                let scaleToUse = RV1
                let validator = true


                for (let i = 1; i < RV1.length; i++) {
                    if (RV1[i] != RV1_min + i) {
                        validator = false
                        break
                    }
                }


                if (!validator) {
                    scaleToUse = RV2
                    validator = true
                    for (let i = 1; i < RV2.length; i++) {
                        if (RV2[i] != RV2_min + i) {
                            validator = false
                            break
                        }
                    }

                }


                if (validator) {
                    return { bool: true, scalevalue: scaleToUse[scaleToUse.length - 1], scalename: 'Straight - ' + `${scaleToUse[0]} to ${scaleToUse[scaleToUse.length - 1]}`, id: 4 };
                } else {
                    return { bool: false }
                }
            }, id: 4
        },
        {
            name: 'Flush', vali: (HAND) => {
                const palo = HAND[0].palo;
                for (let i = 0; i < HAND.length; i++) {
                    if (HAND[i].palo != palo) {
                        return { bool: false };
                    }

                }

                return { bool: true, scalevalue: Scale[0].vali(HAND).scalevalue, scalename: 'Flush of -' + specialValues(palo), id: 5 };

            }, id: 5
        },
        {
            name: 'Full House', vali: (HAND) => {

                const pair = Scale[1].vali(HAND);
                const trio = Scale[3].vali(HAND);
                if (pair.bool && trio.bool) {
                    return { bool: true, scalevalue: `${pair.scalevalue}-${trio.scalevalue}`, scalename: 'Full House - ' + `${specialValues(pair.scalevalue)} and ${specialValues(trio.scalevalue)}`, id: 6 };
                } else {
                    return { bool: false };
                }
            }, id: 6
        },
        {
            name: 'Poker', vali: (HAND) => {
                let card_repeated = false;
                let toDiscart = [];
                let RV = SortMenor(ReplaceAs(Raw_Values(HAND)));

                for (let i = 0; i < RV.length; i++) {
                    if (countRepeat(RV, RV[i]) == 4) {
                        card_repeated = RV[i]
                    } else {

                        toDiscart.push(RV[i])

                    }

                }

                if (card_repeated) {
                    return { bool: true, scalevalue: card_repeated, scalename: 'Poker of -' + specialValues(card_repeated), id: 7, extra: toDiscart };

                } else {
                    return { bool: false };

                }
            }, id: 7
        },
        {
            name: 'Straight Flush', vali: (HAND) => {
                const flush = Scale[5].vali(HAND);
                const straight = Scale[4].vali(HAND);
                if (flush.bool && straight.bool) {

                    return { bool: true, scalevalue: straight.scalevalue, scalename: 'Straight Flush - ' + `${straight.scalename.split("-")[1]}`, id: 8 };
                }


                return { bool: false };

            }, id: 8
        },
        {
            name: 'Royal Flush', vali: (HAND) => {

                const flush = Scale[5].vali(HAND);
                let RV = SortMenor(ReplaceAs(Raw_Values(HAND)));
                if (flush.bool && RV.indexOf(10) != -1 && RV.indexOf(11) != -1 && RV.indexOf(12) != -1 && RV.indexOf(13) != -1 && RV.indexOf(14) != -1) {
                    return { bool: true, scalevalue: 14, scalename: 'Royal Flush-', id: 9 };
                }
                return { bool: false };
            }, id: 9
        },
    ];

    const ReplaceAs = (HAND) => {
        for (let i = 0; i < HAND.length; i++) {
            HAND[i] = isAs(HAND[i])

        }

        return HAND
    }

    const isAs = (card) => {
        if (card == 1) {
            return 14
        } else {
            return card
        }
    }


    const specialValues = (card) => {
        switch (card) {
            case 14:
                return "AS"
            case 11:
                return "JACK"

            case 12:
                return "QUEEN"

            case 13:
                return "KING"

            case "C":
                return "Hearts"
            case "T":
                return "Clubs"
            case "D":
                return "Diamonds"
            case "P":
                return "Spades"

            default:
                return card


        }
    }


    //FUNCIONES DEL DECK
    const Restart_Deck = () => {
        DECK = ORIGINAL_DECK
    }


    const Shuffle_Deck = () => {
        const shuffled = [];

        const SELECT_INDEX = () => {
            let n = 0;
            for (let i = 0; i < 300; i++) {
                n = random(ORIGINAL_DECK.length);

            }
            return n
        }

        for (let i = 0; i < DECK.length; i++) {
            do {
                const index = SELECT_INDEX();

                if (shuffled[index] == undefined) {
                    shuffled[index] = DECK[i];
                    break;
                }


            } while (true);

        }

        DECK = shuffled
        // ORIGINAL_DECK = shuffled
    }

    //FUNCIONES DEL DECK

    //FUNCIONES DEL JUEGO


    const Raw_Values = (H) => {
        let values = [];
        for (let i = 0; i < H.length; i++) {
            values.push(H[i].val)

        }

        return values
    }


    const Evaluate_Hand = (HAND) => {




        // HAND = [
        //     { val: 3, palo: 'D' },
        //     { val: 3, palo: 'C' },
        //     { val: 1, palo: 'T' },
        //     { val: 1, palo: 'T' },
        //     { val: 3, palo: 'T' },

        // ]

        let results = undefined;
        for (let i = 0; i < Scale.length; i++) {
            const res = Scale[i].vali(HAND)
            if (res.bool) {
                results = res
            }

        }

        return results
        // console.log("*********************************");
        // console.log(HAND);
        // console.log(results);
        // console.log("*********************************");

        //usar unshift

    }


    const debug = () => {

        console.log("******************************************************");
        console.log("USER HAND:");
        console.log(USER_HAND);
        console.log("CPU HAND:");
        console.log(CPU_HAND);
        console.log("******************************************************");

    }


    const New_Hand = () => {
        Restart_Deck()
        Shuffle_Deck()

        USER_HAND = []
        CPU_HAND = []

        for (let i = 0; i < 5; i++) {
            const top = [DECK[0], DECK[1]];
            DECK = DECK.slice(2)

            USER_HAND.push(top[0]);
            CPU_HAND.push(top[1]);
        }


        USER_VALUE = Evaluate_Hand(USER_HAND)
        CPU_VALUE = Evaluate_Hand(CPU_HAND)
    }

    const CPU_Thinking = (HAND) => {

        const Flush_Posi = (HAND) => {

            let palos = {
                "C": [],
                "T": [],
                "D": [],
                "P": [],
            };
            for (let i = 0; i < HAND.length; i++) {
                palos[HAND[i].palo].push(HAND[i]);
            }
            let counter = `${Object.keys(palos)[0]}-${palos[Object.keys(palos)[0]].length}`;

            for (let i = 0; i < Object.keys(palos).length; i++) {
                // counter.push(`${Object.keys(palos)[i]}-${palos[Object.keys(palos)[i]].length}`)
                if (palos[Object.keys(palos)[i]].length > counter.split('-')[1]) {
                    counter = `${Object.keys(palos)[i]}-${palos[Object.keys(palos)[i]].length}`
                }
            }

            return [HAND.filter(c => c.palo == counter.split('-')[0]), counter.split('-')]

        }
        const Strai_Posi = (HAND) => {

            const posi = [[], [], [], [], []];
            if (Array.isArray(HAND)) {
                const RV = Raw_Values(HAND);
                for (let i = 0; i < RV.length; i++) {

                    for (let j = 0; j < 5; j++) {
                        if (RV.indexOf(RV[i] + j) != -1) {
                            posi[i].push(HAND[RV.indexOf(RV[i] + j)])
                        }

                    }

                }

            }
            let final = [0, []];
            for (let i = 0; i < posi.length; i++) {
                if (final[0] < posi[i].length) {
                    final[0] = posi[i].length;
                    final[1] = posi[i];
                }

            }




            return final[1]

            // const posi = [];
            // if (Array.isArray(HAND)) {
            //     let H = Raw_Values(HAND);
            //     posi.push(HAND[0])
            //     for (let i = 1; i <= 5; i++) {
            //         if (H.indexOf(H[0] + i) != -1) {
            //             posi.push(HAND[H.indexOf(H[0] + i)])
            //         }
            //     }

            // }
            // return posi
        }
        // console.log(CPU_VALUE.id);

        let P1;
        let P2;

        if (HAND.filter(c => c.val == 1)[0]) {
            P2 = SortMenor(ReplaceAs((HAND)));
        }

        P1 = SortMenor((HAND))


        let StrPosi = [Strai_Posi(P1), Strai_Posi(P2)];

        if (StrPosi[0].length > StrPosi[1].length) {
            StrPosi = StrPosi[0]
        } else {
            StrPosi = StrPosi[1]
        }

        const FlushPosi = Flush_Posi(HAND);

        if (FlushPosi[0].length >= StrPosi.length) {
            return [5, FlushPosi[0]]
        } else {
            return [4, StrPosi]

        }
    }

    const CPU_Selecting_Cards = () => {


        // switch (id) {
        //     case 2:
        //     console.log(2);

        //     break;


        //     case 3:
        //     console.log(3);

        //         break;



        //     case 4:
        //     console.log(4);

        //         break;



        //     case 5:
        //     console.log(5);

        //         break;



        //     case 6:
        //     console.log(6);

        //         break;


        //     case 7:
        //     console.log(7);

        //         break;

        //     case 8:
        //     console.log(8);

        //         break;
        //     case 9:
        //     console.log(9);

        //         break;

        // }

    }

    const CleanDeck =(D)=>{
        return D.filter(d => d != undefined)
    }
    const Send_Cards_to_Deck = () => {


        // e.target.getAttribute('data-active') 
        const UserChange = document.querySelectorAll('[data-active="t"]');
        const card_index = [[], []]
        for (let i = 0; i < UserChange.length; i++) {
            UserChange[i].style.opacity = 0;
            card_index[0].push(parseInt(UserChange[i].parentNode.id.replace('card-USER-', '')))
        }
        // const CPU_HAND = [
        //     { val: 12, palo: "T" },
        //     { val: 3, palo: "D" },
        //     { val: 8, palo: "D" },
        //     { val: 4, palo: "D" },
        //     { val: 3, palo: "T" },

        // ];

        // CPU_HAND = [
        //     { val: 8, palo: "T" },
        //     { val: 7, palo: "D" },
        //     { val: 1, palo: "C" },
        //     { val: 6, palo: "D" },
        //     { val: 5, palo: "T" },

        // ];


        
        // CPU_VALUE = Evaluate_Hand(CPU_HAND);
        console.clear();
        let prob_value = 0;
        if (CPU_VALUE.id == 0 || CPU_VALUE.id == 1) {
            prob_value = CPU_Thinking(CPU_HAND)
            CPU_VALUE = { id: prob_value[0] }
            let toDiscart = [];


            for (let i = 0; i < CPU_HAND.length; i++) {
                if (prob_value[1].findIndex(pro => pro.val == CPU_HAND[i].val && pro.palo == CPU_HAND[i].palo) == -1) {

                    toDiscart.push(CPU_HAND[i])

                }

            }
            CPU_VALUE['extra'] = toDiscart;
        }



        if (Array.isArray(CPU_VALUE.extra)) {
            for (let i = 0; i < CPU_VALUE.extra.length; i++) {
                card_index[1].push(CPU_HAND.findIndex(cd => cd.val == CPU_VALUE.extra[i].val && cd.palo == CPU_VALUE.extra[i].palo))

            }

        }
      

        const toReturn =[];
        for (let i = 0; i < card_index[1].length; i++) {
            toReturn.push(CPU_HAND[card_index[1][i]])
            CPU_HAND[card_index[1][i]] = undefined
        }

        for (let i = 0; i < card_index[0].length; i++) {
            toReturn.push(USER_HAND[card_index[0][i]])
            USER_HAND[card_index[0][i]] = undefined
        }

        DECK = DECK.concat(toReturn)
        Shuffle_Deck()
        DECK = CleanDeck(DECK)
        
        let toDraw =[card_index[0].length, card_index[1].length];

        let maxDraw = card_index[0].length >= card_index[1].length ? card_index[0].length : card_index[1].length;
       
        for (let i = 0; i < maxDraw; i++) {
            let Draw = DECK[0];
            if(toDraw[0] > 0){
                USER_HAND[card_index[0][i]] = Draw
                toDraw[0] --
                DECK = DECK.slice(1)
            }

            if(toDraw[1] > 0){
                Draw = DECK[0];
                CPU_HAND[card_index[1][i]] = Draw
                toDraw[1] --
                DECK = DECK.slice(1)
            }
        }

              

    
        // CPU_Selecting_Cards()

        // REMUEVO LAS CARTAS EN LA MANO DEL USUARIO
        // REMUEVO LAS CARTAS EN LA MANO DE LA CPU
        //CAMBIO LAS REMOCIONES CON NUEVAS CARTAS LAS CARTAS EN LA MANO DEL USUARIO        
        //CAMBIO LAS REMOCIONES CON NUEVAS CARTAS LAS CARTAS EN LA MANO DE LA CPU
        //ACTUALIZO LA MANO DEL JUGADOR
        //DESABILITO EL BUTTON DE CHANGE CARDS
        //HABILITO EL DE SHOW HANDS

    }

    const Show_Hand = () => {

        Reset_Game()
    }


    const Reset_Game = () => {

    }
    /*
    En el póker de 5 cartas (también conocido como Draw Poker), cuando un
     jugador devuelve cartas, esas cartas generalmente vuelven al mazo. 
     Es decir, las cartas descartadas se mezclan nuevamente con el resto del mazo antes de que se repartan nuevas cartas a los jugadores.
    
    Esto asegura que las cartas descartadas puedan ser redistribuidas en la misma mano si el 
    número de cartas en el mazo se reduce significativamente. No quedan permanentemente fuera 
    del juego hasta que se inicie una nueva mano. Sin embargo, algunos grupos o variantes pueden tener reglas específicas, ¡así que siempre es bueno confirmarlas antes de jugar!
     
    */

    // Se compara el valor del trío en cada Full House. El que tenga el trío de mayor valor gana. Por ejemplo:

    // K-K-K 7-7 vence a Q-Q-Q 8-8, porque el trío de reyes es superior al de reinas.

    // Si ambos jugadores tienen el mismo trío, entonces se compara el valor del par. El jugador con el par más alto gana. Ejemplo:

    // 10-10-10 A-A vence a 10-10-10 K-K, porque el par de ases es superior al par de reyes.


    // High Card

    // One Pair

    // Two Pair

    // Trio

    // Straight

    // Flush

    // Full House

    // Poker

    // Straight Flush

    // Royal Flush

    // Carta Alta: Cuando ninguna combinación está formada, la carta más alta decide el ganador (por ejemplo, As alto).

    // Un Par: Dos cartas del mismo valor (ejemplo: 7♠ 7♥).

    // Doble Par: Dos pares diferentes (ejemplo: J♦ J♠ y 3♣ 3♥).

    // Trío (o Trío de Cartas): Tres cartas del mismo valor (ejemplo: K♣ K♠ K♥).

    // Escalera: Cinco cartas consecutivas de diferentes palos (ejemplo: 4♣ 5♠ 6♦ 7♥ 8♣).

    // Color: Cinco cartas del mismo palo, no consecutivas (ejemplo: A♠ 9♠ 7♠ 3♠ 2♠).

    // Full (o Full House): Un trío y un par (ejemplo: 10♦ 10♠ 10♥ y 2♣ 2♥).

    // Póker: Cuatro cartas del mismo valor (ejemplo: Q♣ Q♠ Q♦ Q♥).

    // Escalera de Color: Cinco cartas consecutivas del mismo palo (ejemplo: 5♥ 6♥ 7♥ 8♥ 9♥).

    // Escalera Real (o Flor Imperial): La combinación más fuerte, una escalera de color que va del 10 al As (ejemplo: 10♠ J♠ Q♠ K♠ A♠).

    // const New_Card = () => {
    //     const card = DECK[0];
    //     DECK = DECK.slice(1)
    //     return card

    // }

    //FUNCIONES DEL JUEGO

    //FUNCIONES DEL LA INTERFAZ

    //FUNCIONES DEL JUEGO

    //START


    //SI 2 ROYAL FLUSH, GANA EL JUGADOR
    if (ORIGINAL_DECK.length == 0) {

        for (let i = 0; i < 12; i++) {
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


    New_Hand()
    // debug()


    //START
    return <div>
        <PlayMat>

            <table className="table-hand pabs">
                <tr>
                    <td className="cpu-info-hand txalic">
                        <table className="table-info">
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">MONEY</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">${"XXXXXXXXXXXX"}</label>
                                </td>

                            </tr>
                            <hr color="black" />
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">HAND:</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">??????</label>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">??????</label>
                                </td>

                            </tr>
                        </table>
                    </td>
                    <td>
                        <div id="CPU-HAND" className="pabs w100">

                        </div>
                        {/* <div id="CPU-HAND" className="pabs w100">
                            <HAND_Compo HAND={CPU_HAND} id={'CPU'}></HAND_Compo>
                        </div> */}
                    </td>
                    <td className="txalir">

                    </td>
                </tr>
            </table>

            <div className="bet-container pabs">
                <table className="bet-panel">
                    <tr>
                        <td>
                            <label htmlFor="" className="btn-txt">BET</label>
                        </td>
                        <td>
                            <div>
                                <div className="dinlbl btn-bet">
                                    <button className="point rai-bet btn-txt">+10</button>
                                </div>
                                <div className="dinlbl btn-bet">
                                    <button className="point rai-bet btn-txt">+50</button>
                                </div>
                                <div className="dinlbl btn-bet">
                                    <button className="point rai-bet btn-txt">+100</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="" id="bets" className="btn-txt">${BET}</label>
                        </td>
                        <td>
                            <div>
                                <div className="dinlbl btn-bet">
                                    <button className="point dec-bet btn-txt">-10</button>
                                </div>
                                <div className="dinlbl btn-bet">
                                    <button className="point dec-bet btn-txt">-50</button>
                                </div>
                                <div className="dinlbl btn-bet">
                                    <button className="point dec-bet btn-txt">-100</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style={{ 'padding-left': '1vw', 'padding-top': '1vw' }} className="dinl">
                    <button id="change-card" onClick={() => { Send_Cards_to_Deck() }} className="point btn-txt">CHANGE CARDS</button>
                </div>

                <div style={{ 'padding-left': '1vw', 'padding-top': '1vw' }} className="dinl">
                    <button id="change-card" disabled={true} onClick={() => { Show_Hand() }} className="point btn-txt">SHOW HANDS</button>
                </div>
            </div>

            <table className="table-hand pabs table-hand-user">
                <tr>
                    <td className=" user-info-hand txalic">
                        <table className="table-info">
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">MONEY</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">${"XXXXXXXXXXXX"}</label>
                                </td>

                            </tr>
                            <hr color="black" />
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">HAND:</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">{USER_VALUE.scalename.split("-")[0]}</label>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="" className="b-txt-1">{USER_VALUE.scalename.split("-")[1]}</label>
                                </td>

                            </tr>
                        </table>
                    </td>
                    <td>
                        <div id="USER-HAND">
                            <HAND_Compo HAND={USER_HAND} id={'USER'}></HAND_Compo>
                        </div>
                    </td>
                    <td className="txalir">
                        <button onClick={() => {
                            Back_to_Menu()
                        }} className="point help-button btn-txt">BACK</button>
                        <button onClick={() => {
                            Help_Menu()
                        }} className="point help-button btn-txt">HELP</button>
                    </td>
                </tr>
            </table>

        </PlayMat>
        <Waifu></Waifu>
    </div>




}

function HAND_Compo({ HAND, id }) {
    console.log(HAND);
    const BUILD_CARDS = () => {
        const HAND_COMPONENTS = [];
        for (let i = 0; i < HAND.length; i++) {
            HAND_COMPONENTS.push(
                <div id={`card-${id}-${i}`} className="dinlbl card-cont">
                    <CARD CARD={HAND[i]} id={id} />
                </div>
            )

        }


        let ci = 0;
        let int = setInterval(() => {
            document.getElementById(`card-${id}-${ci}`).style.opacity = 1;
            ci++

            if (ci == HAND.length) {
                clearInterval(int)
            }
        }, 250);
        return HAND_COMPONENTS
    }
    return <div>
        {BUILD_CARDS()}
    </div>
}

function CARD({ CARD, id }) {
    return <img className={`${id == 'USER' ? 'point' : ''} w100 h100`} data-active="f" style={{ top: "-20%" }} onClick={(e) => {
        // e.target.style
        if (id == 'USER') {
            if (e.target.getAttribute('data-active') == 'f') {
                e.target.style.position = "relative";
                e.target.setAttribute('data-active', 't')
            } else {
                e.target.style.position = "static";
                e.target.setAttribute('data-active', 'f')
            }

        }


    }} src={CARD.img} alt="" />

}
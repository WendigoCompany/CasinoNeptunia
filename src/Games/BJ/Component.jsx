// import { useEffect, useState } from "react"
// import { Restart_Deck, Shuffle_Deck, Get_Deck, Set_Deck } from "./Functions"

import Cards_Assets from "../Card_Assets";
import random from "../random";


export default function BlackJack() {

    //MANOS
    let USER_HAND = [];
    let CPU_HAND = [];
    //MANOS

    //ESTADOS DE LA MANO > [FALSE = MANO CERRADA]
    let USER_DRAW = true;
    let CPU_DRAW = true;
    //ESTADOS DE LA MANO > [FALSE = MANO CERRADA]

    let TURN = 'user';

    //VALOR DE LAS MANOS   
    let USER_VALUE = 0;
    let CPU_VALUE = 0;
    //VALOR DE LAS MANOS

    //CARTAS
    let DECK = []
    let ORIGINAL_DECK = []
    //CARTAS

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
        ORIGINAL_DECK = shuffled
    }
    //FUNCIONES DEL DECK

    // FUNCIONES DEL JUEGO

    const New_Hand = () => {
        Restart_Deck()
        Shuffle_Deck()

        USER_HAND = []
        CPU_HAND = []

        for (let i = 0; i < 2; i++) {
            const top = [DECK[0], DECK[1]];
            DECK = DECK.slice(2)

            USER_HAND.push(top[0]);
            CPU_HAND.push(top[1]);
        }
        USER_VALUE = Evaluate_Hand(USER_HAND)
        CPU_VALUE = Evaluate_Hand(CPU_HAND)
    }


    const New_Card = () => {
        const card = DECK[0];
        DECK = DECK.slice(1)
        return card

    }


    const Evaluate_Hand = (HAND) => {
        let value = 0;

        HAND = HAND.sort((a, b) => b.val - a.val);

        for (let i = 0; i < HAND.length; i++) {
            const card = HAND[i].val;
            if (card == 1) {
                if (value + 11 <= 21) {
                    value += 11
                } else {
                    value += 1
                }
            } else {
                value += card
            }



        }
        return value
    }

    const debug = () => {

        console.log("******************************************************");
        console.log("USER HAND:");
        console.log(USER_HAND);
        console.log("CPU HAND:");
        console.log(CPU_HAND);
        console.log("******************************************************");

    }

    const CPU_TURN = () => {
        if (CPU_VALUE < 17) {
            CPU_HAND.push(New_Card())
            CPU_VALUE = Evaluate_Hand(CPU_HAND)

        } else {
            CPU_DRAW = false
        }

        if (USER_DRAW) {
            TURN = "user"
        } else if (CPU_DRAW) {
            TURN = "cpu"
        } else {
            TURN = "null"
        }

        END_TURN()
    }

    const Reset_Game = () => {
        //MANOS
        USER_HAND = [];
        CPU_HAND = [];
        //MANOS

        //ESTADOS DE LA MANO > [FALSE = MANO CERRADA]
        USER_DRAW = true;
        CPU_DRAW = true;
        //ESTADOS DE LA MANO > [FALSE = MANO CERRADA]

        TURN = 'user';

        //VALOR DE LAS MANOS   
        USER_VALUE = 0;
        CPU_VALUE = 0;
        //VALOR DE LAS MANOS

    }

    const END_TURN = () => {

        if (USER_VALUE >= 21) {
            USER_DRAW = false
            DISABLE_USER_PROM()
        }

        debug()
        if (TURN == 'user') {
            ENABLE_USER_PROM()
        } else if (TURN == 'cpu') {
            CPU_TURN()
            UPDATE_LABELS()

        } else {
            console.log("MANO CONCLUIDA");
            console.log("Resulados:" , `USER: ${USER_VALUE}` ,  `CPU: ${CPU_VALUE}`);
            
            Reset_Game()
            ENABLE_USER_PROM()
            New_Hand()
        }

    }

    // FUNCIONES DEL JUEGO

    // FUNCIONES UI
    const UPDATE_LABELS = () => {
        document.getElementById("points-user").textContent = `USER HAND VALUE : ${USER_VALUE}`;
        document.getElementById("points-cpu").textContent = `CPU HAND VALUE : ${CPU_VALUE}`;
    }


    const DISABLE_USER_PROM = () => {
        document.getElementById("user-pasar").disabled = true;
        document.getElementById("user-sacar").disabled = true;
    }

    const ENABLE_USER_PROM = () => {
        document.getElementById("user-pasar").disabled = false;
        document.getElementById("user-sacar").disabled = false;
    }


    // FUNCIONES UI




    //START

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
    New_Hand()
    debug()
    //START


    return <div>
        <button id="user-pasar" onClick={() => {
            USER_DRAW = false
            TURN = ('cpu')
            DISABLE_USER_PROM()
            END_TURN()

        }}>PASAR</button>
        <button id="user-sacar" onClick={() => {
            USER_HAND.push(New_Card())
            USER_VALUE = Evaluate_Hand(USER_HAND)
            TURN = ('cpu')
            DISABLE_USER_PROM()
            END_TURN()


        }}>SACAR CARTA</button>

        <h3 id="points-user">USER HAND VALUE : {USER_VALUE}</h3>
        <h3 id="points-cpu">CPU HAND VALUE : {CPU_VALUE}</h3>

    </div>
}
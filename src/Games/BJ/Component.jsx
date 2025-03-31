import { useEffect, useState } from "react"
import { Restart_Deck, Shuffle_Deck, Get_Deck, Set_Deck } from "./Functions"


export default function BlackJack() {

    let USER_HAND = [];
    let CPU_HAND = [];
    let USER_DRAW = true;
    let CPU_DRAW = true;
    let TURN = 'user';
    let USER_VALUE = 0;
    let CPU_VALUE = 0;


    const New_Hand = () => {
        Restart_Deck()
        Shuffle_Deck()

        USER_HAND = []
        CPU_HAND = []

        for (let i = 0; i < 2; i++) {
            const top = [Get_Deck()[0], Get_Deck()[1]];

            Set_Deck(Get_Deck().slice(2))

            USER_HAND.push(top[0]);
            CPU_HAND.push(top[1]);
        }
        USER_VALUE = Evaluate_Hand(USER_HAND)
        CPU_VALUE = Evaluate_Hand(CPU_HAND)
    }


    const New_Card = () => {
        const card = Get_Deck()[0];
        Set_Deck(Get_Deck().slice(1))
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



    const UPDATE_LABELS = () => {
        document.getElementById("points-user").textContent = `USER HAND VALUE : ${USER_VALUE}`;
        document.getElementById("points-cpu").textContent = `CPU HAND VALUE : ${CPU_VALUE}`;
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

    const DISABLE_USER_PROM = () => {
        document.getElementById("user-pasar").disabled = true;
        document.getElementById("user-sacar").disabled = true;
    }

    const ENABLE_USER_PROM = () => {
        document.getElementById("user-pasar").disabled = false;
        document.getElementById("user-sacar").disabled = false;
    }

    const END_TURN = () => {
        
        debug()
        if (TURN == 'user') {
            ENABLE_USER_PROM()
        } else if (TURN == 'cpu') {
            CPU_TURN()
            UPDATE_LABELS()
        } else {
            console.log("MANO CONCLUIDA");
        }

    }



    //START
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
            if(USER_VALUE >= 21){
                USER_DRAW = false
            }
            END_TURN()


        }}>SACAR CARTA</button>

        <h3 id="points-user">USER HAND VALUE : {USER_VALUE}</h3>
        <h3 id="points-cpu">CPU HAND VALUE : {CPU_VALUE}</h3>

    </div>
}
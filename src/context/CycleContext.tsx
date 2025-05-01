import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction,  } from '../reducers/cycles/actions';
import { differenceInSeconds } from 'date-fns';

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

interface CycleContextProviderProps {
    children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);


export function CycleContextProvider({ children }: CycleContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    }, (initialState) => {
        const storagedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');
        if(storagedStateAsJSON){
            return JSON.parse(storagedStateAsJSON);
        }
        return initialState;
    });

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle){
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
        }

        return 0;
    });

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        };

        dispatch(addNewCycleAction(newCycle));

        setSecondsPassed(0);
    }

    function interruptCurrentCycle(){
        dispatch(interruptCurrentCycleAction());
    }

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);
        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
    },[cyclesState]);

    return (
        <CyclesContext.Provider value={{
            cycles,
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished, 
            amountSecondsPassed, 
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>
            {children}
        </CyclesContext.Provider>
    );
}

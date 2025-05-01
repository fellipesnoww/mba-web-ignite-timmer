import { HandPalm, Play } from 'phosphor-react';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles';
import { createContext, useState } from 'react';
import * as zod from 'zod';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface Cycle{
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'O ciclo precisa ser de no minímo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos')
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;


export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const {
        handleSubmit,
        watch,
        reset
    } = newCycleForm;

    const task = watch('task');
    const isSubmitDisabled = !task;

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    function handleCreateNewCycle(data: NewCycleFormData){
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        };

        setCycles(state => [...state, newCycle]);
        setActiveCycleId(id);
        setSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle(){
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId){
                return {...cycle, interruptedDate: new Date()};
            }
            return cycle;
        }));

        setActiveCycleId(null);
    }

    function markCurrentCycleAsFinished() {
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId){
                return {...cycle, finishedDate: new Date()};
            }
            return cycle;
        }));
    }

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    return (
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
            <HomeContainer>
                <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                    {activeCycle ? (
                        <StopCountdownButton 
                            type="button"
                            onClick={handleInterruptCycle}
                        >
                            <HandPalm />
                            Interromper
                        </StopCountdownButton>
                    ): (
                        <StartCountdownButton 
                            type="submit"
                            disabled={isSubmitDisabled}
                        >
                            <Play />
                            Começar
                        </StartCountdownButton>
                    )}
                    
                </form>
            </HomeContainer>
        </CyclesContext.Provider>
    );
}
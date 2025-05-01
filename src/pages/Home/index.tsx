import { HandPalm, Play } from 'phosphor-react';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles';

import * as zod from 'zod';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { CyclesContext } from '../../context/CycleContext';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'O ciclo precisa ser de no minímo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos')
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;


export function Home() {
    const { createNewCycle, activeCycle, interruptCurrentCycle } = useContext(CyclesContext);
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
    } = newCycleForm;

    const task = watch('task');
    const isSubmitDisabled = !task; 

    return (
            <HomeContainer>
                <form onSubmit={handleSubmit(createNewCycle)}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                    {activeCycle ? (
                        <StopCountdownButton 
                            type="button"
                            onClick={interruptCurrentCycle}
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
    );
}
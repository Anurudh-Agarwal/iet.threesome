import ResultsTable from "../shared/results/ResultsTable";
import ResultsStack from "../shared/results/ResultsStack";
import { useIsMobile } from "@/hooks/useIsMobile";
import useUserTriplet from "@/hooks/useUserTriplet";
import ErrorDialog from "../errors/ErrorDialogBox";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const ResultCard=()=>{
    const {error , triplet , isLoading}= useUserTriplet();
    const isMobile= useIsMobile();
    const [open , setOpen]= useState(true);

    if(error){
      return  <ErrorDialog open={open} onOpenChange={setOpen}  description={error.message}/>;
    }
    if(isLoading){
       return <Spinner/>;
    }
    if(!triplet){
        return null;
    }

    return(<>
        {isMobile
                    ? <ResultsStack triplets={[triplet]}/>
                    : <ResultsTable triplets={[triplet]}/>
        }
    </>)
}
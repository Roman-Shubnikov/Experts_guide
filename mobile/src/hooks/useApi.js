import { useCallback } from "react";
import { API_URL } from "../config";
import { useNavigation } from "./useNavigation";


export const useApi = () => {
    const { goDisconnect } = useNavigation();
    const fetchApi = useCallback(async (method, data={}, http_method='post') => {
        let get_params = window.location.search.replace('?', '');
        try {
            let res = await fetch(API_URL + (get_params ? get_params + '&' : '') + 'method=' + method,
            {
                method: http_method,
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: !(["get", "head"].includes(http_method)) ? JSON.stringify(data) : null,
            })
            res = await res.json();
            if(!res.result) {
                goDisconnect(new Error(res.error.message));
                return null;
            }
            return res.response;
        } catch(e) {
            goDisconnect(e);
            return null;
        }
        
    }, [goDisconnect])
    return {
        fetchApi,
    }
}
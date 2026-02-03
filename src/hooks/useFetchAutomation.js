import { useEffect, useState, useCallback } from "react";
import { showMessage } from 'react-native-flash-message';
import { getAutomation } from "../api/automation";

const useFetchAutomation = ({}) => {
    const [loading, setLoading] = useState(false);
    const [automation, setAutomation] = useState(null);

    const fetchAutomation = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAutomation();

            setAutomation(data.data); // salva i dettagli ordine
        } catch (e) {
            if (e?.response?.data?.error === "automations not found.") {
                setAutomation(null);
            }
            showMessage({
                message: "Attenzione",
                description: "Non siamo riusciti a caricare le automazioni, riprova più tardi!",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAutomation();
    }, [fetchAutomation]);

    return { automation, loading, refetch: fetchAutomation};
};

export default useFetchAutomation;

import { useEffect, useState, useCallback } from "react";
import { showMessage } from 'react-native-flash-message';
import { getBadges } from "../api/badges";

const useFetchBadges = ({}) => {
    const [loading, setLoading] = useState(false);
    const [badges, setBadges] = useState([]);

    const fetchBdges = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getBadges();

            setBadges(data?.badges || []); // salva l'array dei badges
        } catch (e) {
            if (e?.response?.data?.error === "badges not found.") {
                setBadges([]);
            } else {
                showMessage({
                    message: "Attenzione",
                    description: "Non siamo riusciti a caricare i badges, riprova più tardi!",
                    type: "danger",
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBdges();
    }, [fetchBdges]);

    return { badges, loading, refetch: fetchBdges};
};

export default useFetchBadges;

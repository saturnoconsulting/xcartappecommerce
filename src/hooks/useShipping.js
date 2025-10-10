import { useCallback, useState, useEffect } from "react";
import * as orderApi from "api/order";
import { useFocusEffect } from "@react-navigation/native";
import useFetchProfile from "hooks/useFetchProfile";
import { profileFormState } from "components/organisms/ProfileForm";

const useShipping = (fastShip = false, total, localPickUp = false, address) => {
    const [price, setPrice] = useState([]);
    const [shippingPrice, setShippingPrice] = useState();
    const [oneHourShipAvail, setOneHourShipAvail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData] = useFetchProfile(profileFormState);
    let profileAddress;
    let shippingType;
    let totalNew = total.replace('€', '').replace(',', '').trim();
    let cap = address?.cap ? address?.cap : profileData?.cap;

    const fetchFn = useCallback(() => {
        async function fetch() {
            if (!profileData && !address) {
                // Se né profileData né address sono disponibili, non eseguire fetch
                console.log("Profile data or address not available yet");
                return;
            }

            setLoading(true);

            if (address === undefined) {
                profileAddress = {
                    address: profileData?.address,
                    numciv: profileData?.numciv,
                    cap: profileData?.cap,
                    city: profileData?.city,
                    prov: profileData?.prov,
                    country: profileData?.country,
                };
            }
            shippingType = fastShip
                ? "onehourshipping"
                : localPickUp
                    ? "localpickup"
                    : "standard";
                    
            try {
               // console.log("address", address);
               // console.log("profileAddress", profileAddress);
                const { data: oneHourAvail } = await orderApi.checkCAP(cap);
                const { data: shipPrice } = await orderApi.fetchShippingPrice({
                    shippingType,
                    total: totalNew,
                    address: address ?? profileAddress,
                });
                //shipPrice",shipPrice)
                setPrice(shipPrice);
                setOneHourShipAvail(oneHourAvail?.code ? true : false);
            } catch (e) {
                console.log("Error fetching shipping prices", e);
            } finally {
                setLoading(false);
            }
        }

        fetch();
    }, [fastShip, total, localPickUp, address, profileData]);
    // Esegue il calcolo delle spese di spedizione quando il hook è montato
    useEffect(() => {
        if (profileData) {
            fetchFn();
        }
    }, [fetchFn, profileData]);

    // Esegue il calcolo delle spese di spedizione quando la pagina è focalizzata
    useFocusEffect(fetchFn);

    return { oneHourShipAvail, shipTotal: price, loading, refetch: fetchFn };
};

export default useShipping;

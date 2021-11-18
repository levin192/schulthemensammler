import React, {useEffect, useState} from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import {TextField} from "@fluentui/react";
import {Dropdown, DropdownMenuItemType, IDropdownOption} from "@fluentui/react/lib/Dropdown";
import {logger} from "firebase-tools/lib/logger";

export default function SettingsController() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(false);

    const fb = new FirebaseDataProvider();
    const ref = fb.firebaseApp.firestore().collection('settings');

    function getSettings() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data(''));
            })
            setSettings(items);
            setLoading(false);
            console.log(items);
        })
    }

    // function getSettings2() {
    //     setLoading(true);
    //     ref.get().then((item) => {
    //         const items = item.docs.map((doc) => doc.data());
    //         setSettings(items);
    //         setLoading(false);
    //     })
    // }

    useEffect(() => {
        getSettings();
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return <>
        <h1>Settings Controller</h1>
        { settings.map((settings) => (
            <div key={settings.id}>
                <h3>{settings.name}</h3>
                <TextField
                    label="ZumTesten"
                    autoComplete="new-email"
                    type="text"
                    value={settings.name}
                />
            </div>
        ))}
    </>
}

import { Component, useEffect, useState } from 'react';
import { usePDF, BlobProvider, PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import companyLogo from '../../../assets/head_image.png'
import AppointmentService from '../../../api/appointments/appointmentservice';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,

    },
    image: {
        marginBottom: 10,
        width: 50,
        height: 50,
        position: 'absolute',
        right: -60,
        top: 5
    },
});

const PDF_File = (
    <View style={{ paddingRight: 50, paddingLeft: 50 }}>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 10 }}>
            <Image
                src={companyLogo}
                style={styles.image}
            />
            <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>Übersetzungsbüro Qureshi</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', color: 'red' }}>41 JAHRE DOLMETSCHER- UND ÜBERSETZERMANAGEMENT FÜR DIE JUSTIZ</Text>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>Alle afrikanischen, asiatischen, west – und osteuropäischen Sprachen</Text>
        </View>
        <View style={{ marginTop: 30, maxWidth: 180 }}>
            <Text style={{
                fontSize: 10, borderBottomWidth: 2, borderBottomColor: '#112131',
                borderBottomStyle: 'solid', borderBottomColor: 'blue'
            }}>Qureshi, Jorindeweg 2, 30179 Hannover</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 30 }}>
            <Text style={{ fontSize: 10 }}>Amtsgericht Hannover</Text>
            <Text style={{ fontSize: 10 }}>ID</Text>
            <Text style={{ fontSize: 10 }}>Postfach 2 27</Text>
            <Text style={{ fontSize: 10 }}>30002 Hannover.</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 0, fontSize: 10, textAlign: 'right' }}>
            <Text>Hannover, den 06.10.2021</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 0 }}>
            <Text>Sehr geehrte Damen und Herren!</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 0 }}>
            <Text>Wie mit Ihnen vereinbart, werden Sie beim</Text>
            <Text>Amtsgericht Hannover, Volgersweg 1, 30175 Hannover</Text>
            <Text>als Dolmetscher für die Sprache Urdu eingesetzt.</Text>
            <Text>Bitte melden Sie sich Mittwoch, den 6. Oktober 2021 um 11:15 Uhr in Saal 1111.</Text>
            <Text>Nachdrücklich wird um Einhaltung des Termins gebeten.</Text>
            <Text>Ihre Entschädigung erfolgt nach der mit Ihnen getroffenen Vereinbarung</Text>
            <Text>Ich weise Sie darauf hin, dass alle Folgetermine in dieser Sache nur über uns abzurechnen sind.</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 10 }}>
            <Text>mit freundlichen Grüßen</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, borderBottomWidth: 2, borderBottomColor: 'blue', borderBottomStyle: 'solid', marginBottom: 10 }}>
            <Text>i. A. Huzaifa A. Sagri</Text>
            <Text>Anlage: Beleg für die Auszahlung der Vergütung von Dolmetschern</Text>
        </View>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 10, fontSize: 10 }}>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 8 }}>
                <Text>Übersetzungsbüro Qureshi</Text>
                <Text>Jorindeweg 2</Text>
                <Text>30179 Hannover</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 8 }}>
                <Text>Geschäftsleitung:</Text>
                <Text>Mohammad Afzal Qureshi</Text>
                <Text>Allgemein beeidigt und</Text>
                <Text>ermächtigt beim LG Hannover</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 8 }}>
                <Text>Telefon: 0511/6041996</Text>
                <Text>Fax: 0511/6041993</Text>
                <Text>Mobil: 0172/7394392</Text>
                <Text>E-Mail: qureshi.buero@t-online.de</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 8 }}>
                <Text>IBAN:</Text>
                <Text style={{ color: 'red' }}>DE48 2504 0066 0862 1401 00</Text>
                <Text>Steuer-Nr.: 25/134/07134</Text>
                <Text>FA – Hannover - Nord</Text>
            </View>
        </View>
    </View >
)

export const TranslatorContract2 = (
    <Document>
        <Page size="A4" style={styles.page}>
            {PDF_File}
        </Page>
    </Document>
)

export const TranslatorContract = (props) => {
    const [instance, updateInstance] = usePDF({ document: TranslatorContract2 });
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (props.SentFile === true) {
            setCheck(true)
        }
    });

    if (instance.loading) return <div>Loading ...</div>;

    if (instance.error) return <div>Something went wrong: { }</div>;

    if (instance.blob) {
        if (check == true) {
            var service = new AppointmentService();
            var file = new File([instance.blob], "name.pdf");

            let f = new FormData();
            f = new FormData();
            f.append("File[]", file)
            f.append("AppointmentId", props.AppointmentId);
            service.UploadAndEmail(f).then((fileName) => {
            })
            setCheck(false)
        }
    }
    return (
        <div></div>
        // <a href={instance.url} download="test.pdf">
        //     Download
        // </a>
    );
}

const tableRow = {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-evenly',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400
}

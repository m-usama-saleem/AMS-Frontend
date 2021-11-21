import { Component, useEffect, useState } from 'react';
import { PDFViewer, usePDF, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import companyLogo from '../../../assets/head_image.png'
import AppointmentService from '../../../api/appointments/appointmentservice';
import moment from 'moment'
import 'moment/locale/de';

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
        right: 0,
        top: 5
    },
});

export default class TranslatorContract extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Invoice: {},
            val: ' ',
            ready: false,
        }
    }

    componentDidMount() {
        if (this.props && this.props && this.props.Invoice) {
            if (this.props.Invoice.type === "SPRACHEN") {
                this.props.Invoice.translatorType = "Dolmetscher"
            }
            else if (this.props.Invoice.type === "SCHREIBEN") {
                this.props.Invoice.translatorType = "Übersetzer"
            }

            this.setState({ Invoice: this.props.Invoice })
        }
        this.setState({ ready: true })
    }

    render() {
        debugger
        return (
            this.state.ready && <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDF_File Invoice={this.state.Invoice} />
            </PDFViewer>

        )
    }
}

const PDF_File = (props) => {
    const [Invoice, setInvoice] = useState(props.Invoice)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ paddingRight: 50, paddingLeft: 50 }}>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10
                    }}>
                        <Image
                            src={companyLogo}
                            style={styles.image}
                        />
                        <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'extrabold' }}>Übersetzungsbüro Qureshi</Text>
                        <Text style={{ fontSize: 10, textAlign: 'center', color: 'red', marginTop: 10 }}>41 JAHRE DOLMETSCHER- UND ÜBERSETZERMANAGEMENT FÜR DIE JUSTIZ</Text>
                        <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5 }}>Alle afrikanischen, asiatischen, west – und osteuropäischen Sprachen</Text>
                    </View>
                    <View style={{ marginTop: 30, maxWidth: 180 }}>
                        <Text style={{ fontSize: 10, }}>Qureshi, Jorindeweg 2, 30179 Hannover</Text>
                        <Text style={{ color: 'blue', marginTop: -18 }}>__________________</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 20 }}>
                        <Text style={{ fontSize: 10 }}>{Invoice.translatorName}</Text>
                        <Text style={{ fontSize: 10 }}>{Invoice.translatorAddress}</Text>
                    </View>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end',
                        marginTop: 10, fontSize: 10, textAlign: 'right'
                    }}>
                        <Text style={{ textAlign: 'right' }}>Hannover, den {moment().format('DD.MM.YYYY')}
                            {/* {new Date().toLocaleDateString('en-de', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} */}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 10 }}>
                        <Text>Sehr geehrte Damen und Herren!</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 10 }}>
                        <Text style={{ marginTop: 15 }}>Wie mit Ihnen vereinbart, werden Sie beim</Text>
                        <Text style={{ marginTop: 15 }}>{Invoice.institutionAddress}</Text>
                        <Text style={{ marginTop: 15 }}>als {Invoice.translatorType} für die Sprache {Invoice.language} eingesetzt.</Text>
                        <Text style={{ marginTop: 15 }}>Bitte melden Sie sich
                            {/* {Invoice.appointmentDate} */} {moment(Invoice.appointmentDate, "DD-MM-YYYY").locale('de').format('dddd DD MMMM YYYY')} um  {Invoice.appointmentTime} Uhr in Saal {Invoice.roomNumber}.</Text>
                        < Text style={{ marginTop: 15 }}>Nachdrücklich wird um Einhaltung des Termins gebeten.</Text>
                        <Text style={{ marginTop: 15 }}>Ihre Entschädigung erfolgt nach der mit Ihnen getroffenen Vereinbarung</Text>
                        <Text style={{ marginTop: 15 }}>Ich weise Sie darauf hin, dass alle Folgetermine in dieser Sache nur über uns abzurechnen sind.</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 90 }}>
                        <Text>mit freundlichen Grüßen</Text>
                        <Text style={{ marginTop: 10 }}>A. Qureshi</Text>
                    </View>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 20, alignItems: 'center'
                    }}>
                        <Text style={{
                            textAlign: 'center', width: '80%', height: '100%'
                        }}>{Invoice.remarks}</Text>
                    </View>

                    <View style={{ marginTop: 150, fontSize: 10 }}>
                        <Text style={{}}>
                            Nehmen Sie bitte die Kassenanweisung/Einsatzbestätigung (Bitte keine Eintragungen darin
                            vornehmen) mit nach Hause und schicken Sie mir diese per Post zu!
                        </Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'blue' }}>__________________________________________________</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 10 }}>
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
            </Page>
        </Document>
    )
}

export const TranslatorContractDownload = (props) => {
    const [instance, updateInstance] = usePDF({ document: PDF_File({ Invoice: props.Invoice }) });
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (check == false && props.SentFile === true) {
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
            f.append("File[]", file)
            service.DownloadWord(f)
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

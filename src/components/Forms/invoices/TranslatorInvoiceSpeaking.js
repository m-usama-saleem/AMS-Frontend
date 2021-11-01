import { Component, useEffect, useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, usePDF } from '@react-pdf/renderer';
import companyLogo from '../../../assets/head_image.png'
import { CommonValues } from '../../../constants/staticValues';
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
        right: 5,
        top: 5
    },
});

export default class TranslatorInvoiceSpeaking extends Component {

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

            const { totalHours, tax, rideCost, ticketCost, dailyAllowance } = this.props.Invoice;

            var totalHoursCost = parseFloat(totalHours) * CommonValues.HoursCost;
            var totalRideCost = parseFloat(rideCost) * CommonValues.RideCost;
            var TotalDailyAllowance = parseFloat(dailyAllowance) * CommonValues.DailyAllowance;

            var SubTotal = totalHoursCost + totalRideCost + TotalDailyAllowance;
            var TotalTax = SubTotal * (tax / 100);
            var NetPayment = SubTotal + TotalTax + parseFloat(ticketCost)

            this.props.Invoice.totalHoursCost = totalHoursCost.toFixed(2);
            this.props.Invoice.totalRideCost = totalRideCost.toFixed(2);
            this.props.Invoice.totalDailyAllowance = TotalDailyAllowance.toFixed(2);
            this.props.Invoice.subTotal = SubTotal.toFixed(2);
            this.props.Invoice.totalTax = TotalTax.toFixed(2);
            this.props.Invoice.netPayment = NetPayment.toFixed(2);

            this.setState({ Invoice: this.props.Invoice })
        }
        this.setState({ ready: true })
    }

    render() {
        const { Invoice } = this.state;


        return (
            this.state.ready && <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDF_File Invoice={this.state.Invoice} />
            </PDFViewer>

        )
    }
}

const tableRow = {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-evenly',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
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
                        <Text style={{ fontSize: 10, textAlign: 'center', color: 'red', marginTop: 5 }}>41 JAHRE DOLMETSCHER- UND ÜBERSETZERMANAGEMENT FÜR DIE JUSTIZ</Text>
                        <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5 }}>Alle afrikanischen, asiatischen, west – und osteuropäischen Sprachen</Text>
                    </View>
                    <View style={{ marginTop: 30, maxWidth: 180 }}>
                        <Text style={{ fontSize: 10, }}>Qureshi, Jorindeweg 2, 30179 Hannover</Text>
                        <Text style={{ color: 'blue', marginTop: -18 }}>__________________</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 20 }}>
                        <Text style={{ fontSize: 10 }}>{Invoice.appointmentInstitute}</Text>
                        <Text style={{ fontSize: 10 }}>ID</Text>
                        <Text style={{ fontSize: 10 }}>{Invoice.instituteAddress}</Text>
                        {/* <Text style={{ fontSize: 10 }}>30002 Hannover.</Text> */}
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row', fontSize: 10, margin: 0 }}>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text>Ihr Zeichen / Ihre Nachricht  </Text>
                            <Text>ID</Text>
                        </View>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text>Rechnungsnummer</Text>
                            <Text>{Invoice.appointmentId}</Text>
                        </View>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text>Datum</Text>
                            <Text>{Invoice.appointmentDate}</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, margin: 0 }}>
                        <Text>Sehr geehrte Damen und Herren!</Text>
                        <Text style={{ marginTop: 20 }}>Für die Wahrnehmung des folgenden Termins gestatte ich mir, nach dem Justizvergütungs- und
                            Entschädigungsgesetz –JVEG, wie folgt zu berechnen:</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, maxWidth: 80, marginTop: 10 }}>
                        <Text style={{ fontWeight: 'heavy', fontsize: 12, }}>Kostenrechnung:</Text>
                        <Text style={{ marginTop: -10 }}>______________</Text>
                        <Text style={{ marginTop: 10, }}>Sprache: {Invoice.appointmentLanguage}</Text>
                    </View>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, margin: 0
                    }}>
                        <View style={[tableRow, { marginTop: 5 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Termin am:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.appointmentDate}</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Antritt der Reise:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.startOfTheTrip} Uhr</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Terminbeginn:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.appointmentStart} Uhr</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Ende des Termins:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.endOfTheAppointment} Uhr</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Ende der Reise: </Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.endOfTheTrip} Uhr</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 5 }]}>
                            <Text>_________________________________________________________________________</Text>
                        </View>
                    </View>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 10, marginBottom: 20
                    }}>
                        <View style={[tableRow, { marginTop: 0 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Gesamtstunden: </Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalHours} Std.   x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>85,00 €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalHoursCost} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Fahrtkosten:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.rideCost}  km    x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>0,42 € </Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalRideCost} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Tagegeld:</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.dailyAllowance} Tage   x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>14,00 €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalDailyAllowance} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 5 }]}>
                            <Text>_________________________________________________________________________</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Zwischensumme: </Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.subTotal} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>zzgl. MwSt. ({Invoice.tax}%):</Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalTax} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 10 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Bahn/Parktickets::</Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.ticketCost} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 5 }]}>
                            <Text>_________________________________________________________________________</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1, fontWeight: 'extrabold', fontsize: 10 }}>Rechnungsbetrag</Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, fontWeight: 'demibold', fontsize: 10, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.netPayment} €</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 50 }}>
                        <Text>Ich bitte um Überweisung des Rechnungsbetrages, <Text style={{ color: 'red' }}>unter Angabe der Rechnungsnummer</Text>, auf das
                            u.a. Konto und verbleibe</Text>
                        <Text style={{ marginTop: 20 }}>mit freundlichen Grüßen</Text>
                        <Text style={{ marginTop: 10 }}>i. A. Huzaifa A. Sagri</Text>
                        <Text style={{ marginTop: 10 }}>Anlage: Beleg für die Auszahlung der Vergütung von Dolmetschern</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ color: 'blue' }}>__________________________________________________</Text>
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
            </Page>
        </Document>
    )
}

export const TranslatorInvoiceSpeakingDownload = (props) => {
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


// export const TranslatorInvoiceSpeakingDownload = (props) => (
//     <div>
//         <PDFDownloadLink document={PDF_File({
//             Invoice: props.Invoice
//         })} fileName="somename.pdf">
//             {({ blob, url, loading, error }) =>
//                 loading ? 'Loading document...' : 'Download now!'
//             }
//         </PDFDownloadLink>
//     </div>
// )
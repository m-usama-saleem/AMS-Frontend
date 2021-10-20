import { Component } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import companyLogo from '../../../assets/head_image.png'
import { CommonValues } from '../../../constants/staticValues';

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
        if (this.props && this.props.location && this.props.location.Invoice) {

            const { totalHours, tax, rideCost, ticketCost, dailyAllowance } = this.props.location.Invoice;

            var totalHoursCost = parseFloat(totalHours) * CommonValues.HoursCost;
            var totalRideCost = parseFloat(rideCost) * CommonValues.RideCost;
            var TotalDailyAllowance = parseFloat(dailyAllowance) * CommonValues.DailyAllowance;

            var SubTotal = totalHoursCost + totalRideCost + TotalDailyAllowance;
            var TotalTax = SubTotal * (tax / 100);
            var NetPayment = SubTotal + TotalTax + parseFloat(ticketCost)

            this.props.location.Invoice.totalHoursCost = totalHoursCost.toFixed(2);
            this.props.location.Invoice.totalRideCost = totalRideCost.toFixed(2);
            this.props.location.Invoice.totalDailyAllowance = TotalDailyAllowance.toFixed(2);
            this.props.location.Invoice.subTotal = SubTotal.toFixed(2);
            this.props.location.Invoice.totalTax = TotalTax.toFixed(2);
            this.props.location.Invoice.netPayment = NetPayment.toFixed(2);

            this.setState({ Invoice: this.props.location.Invoice })
        }
        this.setState({ ready: true })
    }

    render() {
        const { Invoice } = this.state;

        const PDF_File = <View style={{ paddingRight: 50, paddingLeft: 50 }}>
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
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 20 }}>
                <Text style={{ fontSize: 10 }}>Amtsgericht Hannover</Text>
                <Text style={{ fontSize: 10 }}>ID</Text>
                <Text style={{ fontSize: 10 }}>Postfach 2 27</Text>
                <Text style={{ fontSize: 10 }}>30002 Hannover.</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 10, fontSize: 10 }}>
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
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10 }}>
                <Text>Sehr geehrte Damen und Herren!</Text>
                <Text style={{ marginTop: 30 }}>Für die Wahrnehmung des folgenden Termins gestatte ich mir, nach dem Justizvergütungs- und
                    Entschädigungsgesetz –JVEG, wie folgt zu berechnen:</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, maxWidth: 95 }}>
                <Text style={{
                    fontWeight: 'heavy', fontSize: 12,
                    borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid'
                }}>Kostenrechnung:</Text>
                <Text style={{ marginTop: 10 }}>Sprache: {Invoice.appointmentLanguage}</Text>
            </View>
            <View style={{
                display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10
            }}>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Termin am:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.appointmentDate}</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Antritt der Reise:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.startOfTheTrip} Uhr</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Terminbeginn:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.appointmentStart} Uhr</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Ende des Termins:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.endOfTheAppointment} Uhr</Text>
                </View>
                <View style={[tableRow, { borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid' }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Ende der Reise: </Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.endOfTheTrip} Uhr</Text>
                </View>
            </View>
            <View style={{
                display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10
            }}>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Gesamtstunden: </Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalHours} Std.   x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>85,00 €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalHoursCost} €</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Fahrtkosten:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.rideCost}  km    x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>0,42 € </Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalRideCost} €</Text>
                </View>
                <View style={[tableRow, { borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid' }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Tagegeld:</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.dailyAllowance} Tage   x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>14,00 €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalDailyAllowance} €</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>Zwischensumme: </Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.subTotal} €</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1 }}>zzgl. MwSt. ({Invoice.tax}%):</Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalTax} €</Text>
                </View>
                <View style={[tableRow, { borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid' }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Bahn/Parktickets::</Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.ticketCost} €</Text>
                </View>
                <View style={tableRow}>
                    <Text style={{ display: 'flex', flex: 1, fontWeight: 'bold', fontSize: 12 }}>Rechnungsbetrag</Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1 }}></Text>
                    <Text style={{ display: 'flex', flex: 1, fontWeight: 'bold', fontSize: 12, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.netPayment} €</Text>
                </View>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 20 }}>
                <Text>Ich bitte um Überweisung des Rechnungsbetrages, <Text style={{ color: 'red' }}>unter Angabe der Rechnungsnummer</Text>, auf das
                    u.a. Konto und verbleibe</Text>
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

        return (
            this.state.ready && <PDFViewer style={{ width: '100%', height: '100%' }}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        {PDF_File}
                    </Page>
                </Document>
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
    maxWidth: 400
}

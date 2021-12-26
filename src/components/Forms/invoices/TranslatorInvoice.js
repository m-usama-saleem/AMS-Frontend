import { Component, useState, useEffect } from 'react';
import { usePDF, PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import companyLogo from '../../../assets/head_image.png'
import { CommonValues } from '../../../constants/staticValues';
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
        right: 5,
        top: 5
    },
});

export default class TranslatorInvoice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Invoice: {},
            val: ' ',
            ready: false,
        }
    }
    componentDidMount() {
        if (this.props && this.props.Invoice) {
            const { wordCount, tax, rate, flatRate, postage, paragraph } = this.props.Invoice;
            var Lines = wordCount / CommonValues.WordsPerLine * rate;
            var TotalFlatRate = flatRate * CommonValues.FlatRateCost;
            var TotalPostage = postage * CommonValues.PostageCost;
            var TotalParagraph = paragraph * CommonValues.ParagraphCost;
            var InvoiceRate = parseFloat(rate) != 0 ? parseFloat(rate).toFixed(2) : CommonValues.RateCost.toFixed(2);
            var WordRate = parseFloat(wordCount / CommonValues.WordsPerLine).toFixed(2);
            var SubTotal = Lines + TotalFlatRate + TotalPostage + TotalParagraph;
            var TotalTax = SubTotal * (tax / 100);
            var NetPayment = SubTotal + TotalTax

            this.props.Invoice.lines = Lines.toFixed(2);
            this.props.Invoice.totalFlatRate = TotalFlatRate.toFixed(2);
            this.props.Invoice.totalPostage = TotalPostage.toFixed(2);
            this.props.Invoice.totalParagraph = TotalParagraph.toFixed(2);
            this.props.Invoice.subTotal = SubTotal.toFixed(2);
            this.props.Invoice.totalTax = TotalTax.toFixed(2);
            this.props.Invoice.netPayment = NetPayment.toFixed(2);
            this.props.Invoice.netPayment = NetPayment.toFixed(2);
            this.props.Invoice.rate = InvoiceRate;
            this.props.Invoice.wordRate = WordRate;
            this.props.Invoice.wordRateTotal = (WordRate * InvoiceRate).toFixed(2);

            this.setState({ Invoice: this.props.Invoice })
        }
        this.setState({ ready: true })
    }

    render() {
        const { Invoice } = this.state;
        return (
            this.state.ready &&
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDF_File Invoice={Invoice} />
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
                        <Text style={{ fontSize: 10 }}>{Invoice.appointmentId}</Text>
                        <Text style={{ fontSize: 10 }}>{Invoice.instituteAddress}</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 10, fontSize: 10 }}>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text>Ihr Zeichen / Ihre Nachricht</Text>
                            <Text>Siehe oben!</Text>
                        </View>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontWeight: 'bold' }}>Rechnungsnummer</Text>
                            <Text>{Invoice.invoiceID}</Text>
                        </View>
                        <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Text>Datum</Text>
                            <Text>{moment().format('DD.MM.YYYY')}</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10 }}>
                        <Text>Sehr geehrte Damen und Herren!</Text>
                        <Text style={{ marginTop: 30 }}>Für die anliegenden Übersetzungen gestatte ich mir, nach dem Justizvergütungs- und
                            Entschädigungsgesetz –JVEG, wie folgt zu berechnen:</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, maxWidth: 95, marginTop: 20 }}>
                        <Text style={{ fontWeight: 'heavy', fontSize: 12, }}>Kostenrechnung:</Text>
                        <Text style={{ marginTop: -10 }}>________________</Text>
                        <Text style={{ marginTop: 10 }}>Sprache: Urdu</Text>
                    </View>
                    <View style={{
                        display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10
                    }}>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Zeilen</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.wordRate} Zeilen x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.rate} €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.wordRateTotal} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Pauschale</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.flatRate} x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.FlatRateCost.toFixed(2)} €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalFlatRate} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>§7Abs 2</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.paragraph} Seiten x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.ParagraphCost.toFixed(2)} €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalParagraph} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>Porto</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.postage}       x</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.PostageCost} €</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalPostage} €</Text>
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
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1 }}>zzgl. MwSt. ({Invoice.tax}%):</Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalTax} €</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 5 }]}>
                            <Text>_________________________________________________________________________</Text>
                        </View>
                        <View style={[tableRow, { marginTop: 15 }]}>
                            <Text style={{ display: 'flex', flex: 1, fontWeight: 'bold', fontSize: 12 }}>Rechnungsbetrag</Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1 }}></Text>
                            <Text style={{ display: 'flex', flex: 1, fontWeight: 'bold', fontSize: 12, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.netPayment} €</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 80 }}>
                        <Text>Ich bitte um Überweisung des Rechnungsbetrages, <Text style={{ color: 'red' }}>unter Angabe der Rechnungsnummer</Text>, auf das
                            u.a. Konto und verbleibe</Text>
                        <Text style={{ marginTop: 20 }}>mit freundlichen Grüßen</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, marginTop: 70 }}>
                        <Text>i. A. Huzaifa A. Sagri</Text>
                        <Text style={{ marginTop: 5 }}>Anlage: Zeilenangabe, Übersetzung, Original</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ color: 'blue' }}>__________________________________________________</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 5, fontSize: 10 }}>
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

export const TranslatorInvoiceDownload = (props) => {
    const [instance, updateInstance] = usePDF({ document: PDF_File({ Invoice: props.Invoice }) });
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (check != props.SentFile) {
            setCheck(props.SentFile)
        }
    });

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

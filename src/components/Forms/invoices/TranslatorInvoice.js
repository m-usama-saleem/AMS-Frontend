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
        if (this.props && this.props.location && this.props.location.Invoice) {
            const { wordCount, tax, rate, flatRate, postage, paragraph } = this.props.location.Invoice;
            var Lines = wordCount / CommonValues.WordsPerLine * rate;
            var TotalFlatRate = flatRate * CommonValues.FlatRateCost;
            var TotalPostage = postage * CommonValues.PostageCost;
            var TotalParagraph = paragraph * CommonValues.ParagraphCost;

            var SubTotal = Lines + TotalFlatRate + TotalPostage + TotalParagraph;
            var TotalTax = SubTotal * (tax / 100);
            var NetPayment = SubTotal + TotalTax

            this.props.location.Invoice.lines = Lines.toFixed(2);
            this.props.location.Invoice.totalFlatRate = TotalFlatRate.toFixed(2);
            this.props.location.Invoice.totalPostage = TotalPostage.toFixed(2);
            this.props.location.Invoice.totalParagraph = TotalParagraph.toFixed(2);
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
                    <Text>Ihr Zeichen / Ihre Nachricht</Text>
                    <Text>Siehe oben!</Text>
                </View>
                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold' }}>Rechnungsnummer</Text>
                    <Text>{Invoice.appointmentId}</Text>
                </View>
                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <Text>Datum</Text>
                    <Text>{Invoice.appointmentDate}</Text>
                </View>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10 }}>
                <Text>Sehr geehrte Damen und Herren!</Text>
                <Text style={{ marginTop: 30 }}>Für die anliegenden Übersetzungen gestatte ich mir, nach dem Justizvergütungs- und
                    Entschädigungsgesetz –JVEG, wie folgt zu berechnen:</Text>
            </View>
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, maxWidth: 95, marginTop: 20 }}>
                <Text style={{
                    fontWeight: 'heavy', fontSize: 12,
                    borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid'
                }}>Kostenrechnung:</Text>
                <Text style={{ marginTop: 10 }}>Sprache: Urdu</Text>
            </View>
            <View style={{
                display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10
            }}>
                <View style={[tableRow, { marginTop: 10 }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Zeilen</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.wordCount / CommonValues.WordsPerLine} Zeilen x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>1,95 €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>1,95 €</Text>
                </View>
                <View style={[tableRow, { marginTop: 10 }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Pauschale</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.flatRate} x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.FlatRateCost} €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalFlatRate} €</Text>
                </View>
                <View style={[tableRow, { marginTop: 10 }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>§7Abs 2</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.paragraph} Seiten x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.ParagraphCost} €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalParagraph} €</Text>
                </View>
                <View style={[tableRow, { marginTop: 10 }]}>
                    <Text style={{ display: 'flex', flex: 1 }}>Porto</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.postage}       x</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{CommonValues.PostageCost} €</Text>
                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>{Invoice.totalPostage} €</Text>
                </View>
                <View style={[tableRow, { borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid', marginTop: 15 }]}>
                </View>
                <View style={[tableRow, { marginTop: 10 }]}>
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
                <View style={[tableRow, { borderBottomWidth: 2, borderBottomColor: '#112131', borderBottomStyle: 'solid', marginTop: 15 }]}>
                </View>
                <View style={[tableRow, { marginTop: 10 }]}>
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
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', fontSize: 10, borderBottomWidth: 2, borderBottomColor: 'blue', borderBottomStyle: 'solid', marginBottom: 10, marginTop: 10 }}>
                <Text>i. A. Huzaifa A. Sagri</Text>
                <Text style={{ marginTop: 10 }}>Anlage: Zeilenangabe, Übersetzung, Original</Text>
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
            this.state.ready &&
            <PDFViewer style={{ width: '100%', height: '100%' }}>
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

{/*                     
                        <View>
                            <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                <Text style={{ fontSize: 48, textAlign: 'center', fontWeight: 'bold' }}>Übersetzungsbüro Qureshi</Text>
                                <Text style={{ fontSize: 24, textAlign: 'center', color: 'red' }}>41 JAHRE DOLMETSCHER- UND ÜBERSETZERMANAGEMENT FÜR DIE JUSTIZ</Text>
                                <Text style={{ fontSize: 24, textAlign: 'center' }}>Alle afrikanischen, asiatischen, west – und osteuropäischen Sprachen</Text>
                            </View>
                            <View style={{ marginTop: 40 }}>
                                <Text style={{ fontSize: 16, lineHeight: 5 }}>Qureshi, Jorindeweg 2, 30179 Hannover</Text>
                            </View>
                            <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                <Text>Amtsgericht Hannover</Text>
                                <Text>ID</Text>
                                <Text>Postfach 2 27</Text>
                                <Text>30002 Hannover</Text>
                            </View>
                            <View style={{ display: 'flex', flex: 1, flexDirection: 'row', marginTop: 50 }}>
                                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                    <Text>Amtsgericht Hannover</Text>
                                    <Text>ID</Text>
                                </View>
                                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                    <Text>Amtsgericht Hannover</Text>
                                    <Text>ID</Text>
                                </View>
                                <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                    <Text>Amtsgericht Hannover</Text>
                                    <Text>ID</Text>
                                </View>
                            </View>
                            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 50 }}>
                                <Text>Sehr geehrte Damen und Herren!</Text>
                                <Text style={{ marginTop: 30 }}>Für die anliegenden Übersetzungen gestatte ich mir, nach dem Justizvergütungs- und
                                    Entschädigungsgesetz –JVEG, wie folgt zu berechnen:</Text>
                            </View>
                            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', marginTop: 50 }}>
                                <Text style={{ fontWeight: 'bold' }}>Kostenrechnung:</Text>
                                <Text style={{ marginTop: 20 }}>Sprache: Urdu</Text>
                            </View>
                            <View style={{
                                display: 'flex', flex: 1, flexDirection: 'column', marginTop: 50
                            }}>
                                <View style={tableRow}>
                                    <Text style={{ display: 'flex', flex: 1 }}>Zeilen</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1 Zeilen x</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1,95 €</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1,95 €</Text>
                                </View>
                                <View style={tableRow}>
                                    <Text style={{ display: 'flex', flex: 1 }}>Pauschale</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>x</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>20,00 €</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>0,00 €</Text>
                                </View>
                                <View style={tableRow}>
                                    <Text style={{ display: 'flex', flex: 1 }}>§7Abs 2</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>Seiten x</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>0,50 €</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>0,00 €</Text>
                                </View>
                                <View style={tableRow}>
                                    <Text style={{ display: 'flex', flex: 1 }}>Porto</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1       x</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1,55 €</Text>
                                    <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>1,55 €</Text>
                                </View>
                                 <hr
                                    style={{
                                        ...tableRow,
                                        color: 'black',
                                        backgroundColor: 'black',
                                        height: 5
                                    }}
                                /> 
                        <View style={tableRow}>
                            <Text style={{ display: 'flex', flex: 1 }}>Zwischensumme: </Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>3,50 €</Text>
                        </View>
                        <View style={tableRow}>
                            <Text style={{ display: 'flex', flex: 1 }}>zzgl. MwSt. (19%):</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>0,67 €</Text>
                        </View>
                        <hr
                                    style={{
                                        ...tableRow,
                                        color: 'black',
                                        backgroundColor: 'black',
                                        height: 5
                                    }}
                                />
                        <View style={tableRow}>
                            <Text style={{ display: 'flex', flex: 1 }}>Rechnungsbetrag</Text>
                            <Text style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>4,17 €</Text>
                        </View>
                    </View>
                </View >
                     */}
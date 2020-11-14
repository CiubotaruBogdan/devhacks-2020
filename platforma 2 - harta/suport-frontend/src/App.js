import * as React from "react"
import superagent from "superagent"
import ReactMapGL, {Marker} from "react-map-gl"
import {Image, Button, Toast, Modal, Form, Col, Table} from "react-bootstrap"
import {FaChild, FaRandom, FaCrown} from "react-icons/fa"
import {GoDiffAdded} from "react-icons/go"
import {IoMdArrowRoundBack} from "react-icons/io"

import "./stylesheets/App.css"

class App extends React.Component{

    // Set the default state
    default_state = {
        viewport: {
            width: "100vw",
            height: "100vh",
            latitude: 45.960613,
            longitude: 24.824151,
            zoom: 5.8
        },
        children: [],
        donors: [],
        max_index: -1,
        detailed_child: null,
        showed_elements: {
            child_toast: false,
            help_modal: false,
            add_modal: false,
            donors_modal: false
        },
        input_values: {
            name: "",
            latitude: "",
            longitude: "",
            full_address: "",
            phone_number: "",
            needs: [],
            family_status: []
        }
    }
    state = JSON.parse(JSON.stringify(this.default_state))

    componentDidMount(){
        this.getAllChildren()
    }

    // Change the viewport of the map
    changeMapViewport = viewport => this.setState({viewport})

    // Get all details about children
    getAllChildren(){

        superagent
            .get("https://devhacks-api.loca.lt/get_children")
            .set("Access-Control-Allow-Origin", "*")
            .send()
            .then(res => {
                
                var children = JSON.parse(res.text)

                this.setState({
                    children: children,
                    max_index: children[children.length - 1].id
                })

            }).catch(error => {
                console.error(error)
            })

    }

    // Get top ranked donors
    getTopDonors(){

        superagent
            .get("https://devhacks-api.loca.lt/get_donors")
            .set("Access-Control-Allow-Origin", "*")
            .send()
            .then(res => {
                
                var donors = JSON.parse(res.text)

                this.setState({
                    donors: donors,
                    showed_elements: {
                        child_toast: false,
                        help_modal: false,
                        add_modal: false,
                        donors_modal: true
                    }
                })

            }).catch(error => {
                console.error(error)
            })

    }

    // Get full details of a specific child
    getChildFullDetails(id, toast_state, help_state){

        superagent
            .get("https://devhacks-api.loca.lt/get_child_details/" + id)
            .set("Access-Control-Allow-Origin", "*")
            .send()
            .then(res => {
                this.setState({
                    detailed_child: JSON.parse(res.text),
                    showed_elements: {
                        child_toast: toast_state,
                        help_modal: help_state,
                        add_modal: false,
                        donors_modal: false
                    }
                })
            }).catch(error => {
                console.error(error)
            })

    }

    // Get a random child to help
    selectRandomChild(){

        this.getChildFullDetails(
            Math.floor(Math.random() * this.state.max_index + 1),
            false,
            true
        )

    }

    // Close the toast containing child details
    closeeAllOverlays(){

        this.setState({
            showed_elements: {
                child_toast: false,
                help_modal: false,
                add_modal: false,
                donors_modal: false
            }
        })

    }

    // Set the visibility of the help modal
    setHelpModal(state){

        this.setState({
            showed_elements: {
                child_toast: false,
                help_modal: state,
                add_modal: false,
                donors_modal: false
            }
        })

    }

    // Set the visibility of the add modal
    setAddModal(state){

        this.setState({
            showed_elements: {
                child_toast: false,
                help_modal: false,
                add_modal: state,
                donors_modal: false
            }
        })

    }

    // Handle the change of alphanumeric inputs
    handleChange = event => {

        var {name, value} = event.target
        var new_state = this.state.input_values

        new_state[name] = value
        this.setState({
            input_values: new_state
        })

    }

    // Handle the change of checkboxes
    handleCheckboxClick(name, value){

        var new_state = this.state.input_values
        var index = new_state[name].indexOf(value)

        if (index > 0){
            new_state[name].splice(index, 1)
        }
        else{
            new_state[name].push(value)
        }
        this.setState({
            input_values: new_state
        })

    }

    // Add new child
    addChild(){

        var input_values = this.state.input_values

        return superagent
            .post("https://devhacks-api.loca.lt/add_child")
            .set("Access-Control-Allow-Origin", "*")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send({
                name: input_values.name,
                latitude: input_values.latitude,
                longitude: input_values.longitude,
                full_address: input_values.full_address,
                phone_number: input_values.phone_number,
                needs: input_values.needs.join(),
                family_status: input_values.family_status[0]
            }).then(res => {
                this.setAddModal(false)
                if (Number(res.text) > 0)
                    this.getAllChildren()
            }).catch(error => {
                console.error(error)
            })

    }

    // Render the component
    render(){

        // Create markers for map
        var markers = this.state.children.map(element => {
            return (
                <Marker
                    latitude={element.latitude}
                    longitude={element.longitude}
                    className="marker"
                    offsetLeft={-20} offsetTop={-10}
                >
                    <FaChild
                        onClick={
                            () => this.getChildFullDetails(element.id, true, false)
                        }
                    />
                </Marker>
            )
        })

        if (this.state.detailed_child){

            var child = this.state.detailed_child

            // Create the toast containing selected child details
            var child_toast =
                <Toast className="toast"
                       show={this.state.showed_elements.child_toast}
                       onClose={this.closeeAllOverlays.bind(this)}>
                    <Toast.Header>
                        <strong className="mr-auto">
                            <b>{child.name}</b> are nevoie de ajutorul tău!
                        </strong>
                    </Toast.Header>
                <Toast.Body>
                {child.name} provine dintr-o familie cu <b>{child.family_status}</b>. Are un grad de abandon școlar de <b>{child.abandonment_degree}%</b>, însă ajutorul tău cu <b>{child.needs}</b> ar putea să îl scadă.
                    <br/><br/>
                    <Button className="red-button"
                            variant="primary"
                            size="sm"
                            block
                            onClick={this.setHelpModal.bind(this, true)}
                    >
                        Ajută
                    </Button>
                </Toast.Body>
            </Toast>

            // Create modal with more details about a child
            var help_modal = <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.showed_elements.help_modal}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Încă puțin și <b>{child.name}</b> primește ajutorul tău!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {child.name} provine dintr-o familie cu <b>{child.family_status}</b>. Are un grad de abandon școlar de <b>{child.abandonment_degree}%</b>, însă ajutorul tău cu <b>{child.needs}</b> ar putea să îl scadă.
                    <br/><br/>
                    Îi poți contacta parinții la numărul de telefon <b>{child.phone_number}</b> sau îi poți face o surpriză mergând sau livrând la domiciliu, la adresa <b>{child.full_address}</b>.
                    <br/><br/>
                    <Form>
                        <Form.Control size="sm" type="text"
                                    placeholder="Nume Complet"
                                    className="padded-input"
                        />
                        <Form.Control size="sm" type="text"
                                    placeholder="Nevoile Acoperite de Ajutorul Dumneavoastră"
                                    className="padded-input"
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="red-button"
                            onClick={this.addChild.bind(this)}>
                        Salvează
                    </Button>
                    <Button className="dark-button"
                        onClick={this.setHelpModal.bind(this, false)}
                    >
                        Închide
                    </Button>
                </Modal.Footer>
            </Modal>

        }

        // Create modal for adding a new child in the system
        var add_modal = <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showed_elements.add_modal}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Adaugă un copil care are nevoie de ajutor!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control size="sm" type="text" name="name"
                                  placeholder="Nume Complet"
                                  value={this.state.input_values.name}
                                  onChange={this.handleChange}
                                  className="padded-input"
                    />
                    <Form.Row>
                        <Col>
                            <Form.Control
                                size="sm" type="number"
                                name="latitude" placeholder="Latitudine"
                                value={this.state.input_values.latitude}
                                onChange={this.handleChange}
                                className="padded-input"
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                size="sm" type="number"
                                name="longitude" placeholder="Longitudine"
                                value={this.state.input_values.longitude}
                                onChange={this.handleChange}
                                className="padded-input"
                            />
                        </Col>
                    </Form.Row>
                    <Form.Control size="sm" type="text"
                                  placeholder="Adresa Domiciliului" name="full_address" value={this.state.input_values.full_address} onChange={this.handleChange} className="padded-input"/>
                    <Form.Control size="sm" type="text"
                                  placeholder="Număr de Telefon" name="phone_number" value={this.state.input_values.phone_number} onChange={this.handleChange} className="padded-input"/>
                    <Form.Row>
                        <Col>
                            <Form.Label><b>Nevoile Copilului</b></Form.Label><br/>
                            <Form.Group id="needs">
                                <Form.Check type="checkbox"
                                            label="calculator"
                                            onClick={this.handleCheckboxClick.bind(this, "needs", 0)}
                                />
                                <Form.Check type="checkbox"
                                            label="tabletă"
                                            onClick={this.handleCheckboxClick.bind(this, "needs", 1)}
                                />
                                <Form.Check type="checkbox"
                                            label="rechizite"
                                            onClick={this.handleCheckboxClick.bind(this, "needs", 2)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Label><b>Starea Familiei</b></Form.Label><br/>
                            <Form.Group id="family_status">
                                <Form.Check type="radio"
                                            label="ambii parinti angajati"
                                            onClick={this.handleCheckboxClick.bind(this, "family_status", 0)}
                                />
                                <Form.Check type="radio"
                                            label="un parinte angajat, altul somer"
                                            onClick={this.handleCheckboxClick.bind(this, "family_status", 1)}
                                />
                            </Form.Group>
                        </Col>
                    </Form.Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="red-button"
                        onClick={this.addChild.bind(this)}>
                    Adaugă
                </Button>
                <Button className="dark-button"
                        onClick={this.setAddModal.bind(this, false)}>
                    Închide
                </Button>
            </Modal.Footer>
        </Modal>

        // Create modal with top donors
        var donors_rows = this.state.donors.map((donor, index) =>  
            <tr>
                <td><FaCrown/></td>
                <td>{donor.name}</td>
                <td>{donor.donation_sum}</td>
            </tr>
        );
        var donors_modal = <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.showed_elements.donors_modal}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Topul Donatorilor
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Poziție</th>
                        <th>Nume Complet</th>
                        <th>Sumă Donată</th>
                    </tr>
                </thead>
                <tbody>
                    {donors_rows}
                </tbody>
            </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button className="dark-button"
                    onClick={this.closeeAllOverlays.bind(this)}
                >
                    Inchide
                </Button>
            </Modal.Footer>
        </Modal>

        return (
            <>

                {/* Map with markers and borders..*/}
                <ReactMapGL
                    {...this.state.viewport}
                    mapboxApiAccessToken="pk.eyJ1IjoiaW9zaWZhY2hlIiwiYSI6ImNrYjlwb2hqMTBnYWUycnJ4bGNxcDVzb2EifQ.VJlYYZGiM5gzrsCBbVyKEw"
                    onViewportChange={this.changeMapViewport}
                >
                    {markers}
                </ReactMapGL>
                <div className="custom-border bottom-border"></div>
                <div className="custom-border upper-border"></div>
                <div className="custom-border left-border"></div>
                <div className="custom-border right-border"></div>

                {/* Logo, buttons and a crown */}
                <a href="https://roguetesting.club/devHacks2020/">
                    <Image src="images/logo.png" className="logo"></Image>
                </a>
                <Button className="menu-button random red-button"
                        onClick={this.selectRandomChild.bind(this)}
                >
                    <FaRandom/>Alege Aleator
                </Button>
                <Button className="menu-button add red-button"
                        onClick={this.setAddModal.bind(this, true)}
                >
                    <GoDiffAdded/>Adaugă
                </Button>
                <a href="https://roguetesting.club/devHacks2020/">
                    <Button className="menu-button back dark-button">
                        <IoMdArrowRoundBack/>Înapoi
                    </Button>
                </a>
                <FaCrown className="crown" onClick={this.getTopDonors.bind(this)}/>

                {/* Child toast and modals*/}
                {child_toast}
                {help_modal}
                {add_modal}
                {donors_modal}

          </>
        )

    }

}

export default App
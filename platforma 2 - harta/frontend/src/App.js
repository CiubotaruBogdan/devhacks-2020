import * as React from "react"
import superagent from "superagent"
import ReactMapGL, {Marker} from "react-map-gl"
import {Image, Button, Toast, Modal, Form, Col} from "react-bootstrap"
import {FaChild} from "react-icons/fa"

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
        detailed_child: null,
        showed_elements: {
            child_toast: false,
            help_modal: false,
            add_modal: false
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
            .get("http://127.0.0.1:5000/get_children")
            .set("Access-Control-Allow-Origin", "*")
            .send()
            .then(res => {
                this.setState({
                    children: JSON.parse(res.text)
                })
            }).catch(error => {
                console.error(error)
            })

    }

    // Get full details of a specific child
    getChildFullDetails(id){

        superagent
            .get("http://127.0.0.1:5000/get_child_details/" + id)
            .set("Access-Control-Allow-Origin", "*")
            .send()
            .then(res => {
                this.setState({
                    detailed_child: JSON.parse(res.text),
                    showed_elements: {
                        child_toast: true
                    }
                })
            }).catch(error => {
                console.error(error)
            })

    }

    // Close the toast containing child details
    closeChildToast(){

        this.setState({
            showed_elements: {
                child_toast: false
            }
        })

    }

    // Set the visibility of the help modal
    setHelpModal(state){

        this.setState({
            showed_elements: {
                child_toast: false,
                help_modal: state,
                add_modal: false
            }
        })

    }

    // Set the visibility of the add modal
    setAddModal(state){

        this.setState({
            showed_elements: {
                child_toast: false,
                help_modal: false,
                add_modal: state
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
            .post("http://127.0.0.1:5000/add_child")
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
                        onClick={() => this.getChildFullDetails(element.id)}
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
                       onClose={this.closeChildToast.bind(this)}>
                    <Toast.Header>
                        <strong className="mr-auto">
                            <b>{child.name}</b> are nevoie de ajutorul tau!
                        </strong>
                    </Toast.Header>
                <Toast.Body>
                    Provine dintr-o familie cu <b>{child.family_status}</b>. Are un grad de abandon scolar de <b>{child.abandonment_degree} / 10</b>, insa ajutorul tau cu <b>{child.needs}</b> ar putea sa il scada.
                    <br/><br/>
                    <Button className="red-button"
                            variant="primary"
                            size="sm"
                            block
                            onClick={this.setHelpModal.bind(this, true)}
                    >
                        Ajuta!
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
                        Inca putin si <b>{child.name}</b> primeste ajutorul tau!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Provine dintr-o familie cu <b>{child.family_status}</b>. Are un grad de abandon scolar de <b>{child.abandonment_degree} / 10</b>, insa ajutorul tau cu <b>{child.needs}</b> ar putea sa il scada.
                    <br/><br/>
                    Il poti contacta la numarul de telefon <b>{child.phone_number}</b> sau ii poti face o surpriza mergand la domiciliul lui, la adresa <b>{child.full_address}</b>.
                </Modal.Body>
                <Modal.Footer>
                    <Button className="dark-button"
                        onClick={this.setHelpModal.bind(this, false)}
                    >
                        Inchide
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
                    Adauga un copil care are nevoie de ajutor!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control size="sm" type="text" name="name"
                                  placeholder="Numele Complet"
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
                                  placeholder="Numar de Telefon" name="phone_number" value={this.state.input_values.phone_number} onChange={this.handleChange} className="padded-input"/>
                    <Form.Row>
                        <Col>
                            <Form.Label><b>Nevoi</b></Form.Label><br/>
                            <Form.Group id="needs">
                                <Form.Check type="checkbox"
                                            label="calculator"
                                            onClick={this.handleCheckboxClick.bind(this, "needs", 0)}
                                />
                                <Form.Check type="checkbox"
                                            label="tableta"
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
                    Adaugare
                </Button>
                <Button className="dark-button"
                        onClick={this.setAddModal.bind(this, false)}>
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
                <div class="custom-border bottom-border"></div>
                <div class="custom-border upper-border"></div>
                <div class="custom-border left-border"></div>
                <div class="custom-border right-border"></div>

                {/* Logo and buttons */}
                <Image src="images/logo.png" className="logo"></Image>
                <Button className="menu-button add red-button"
                        onClick={this.setAddModal.bind(this, true)}
                >
                    Adauga un Copil
                </Button>
                <a href="https://roguetesting.club/devHacks2020/">
                    <Button className="menu-button back dark-button">
                        Inapoi
                    </Button>
                </a>

                {/* Child toast and modals*/}
                {child_toast}
                {help_modal}
                {add_modal}

          </>
        )

    }

}

export default App
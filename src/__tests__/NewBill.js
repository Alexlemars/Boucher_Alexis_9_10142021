import { screen,fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"
window.alert = jest.fn();

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render a New Bill form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      // Test la modal  
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    })

    test("Then it should render 8 entrie",()=>{
      const html = NewBillUI()
      document.body.innerHTML = html

      //Test le select type de depensse
      expect(screen.getByTestId('expense-type')).toBeTruthy()
      
      //Test le nom de la depensse
      expect(screen.getByTestId('expense-name')).toBeTruthy()

      //Test la date de la depensse
      expect(screen.getByTestId('datepicker')).toBeTruthy()

      //Test le montant TTC
      expect(screen.getByTestId('amount')).toBeTruthy()

      //Test l'input de la TVA
      expect(screen.getByTestId('vat')).toBeTruthy()

      //Test l'input de la TVA
      expect(screen.getByTestId('pct')).toBeTruthy()

      //Test l'inpput du commentaire
      expect(screen.getByTestId('commentary')).toBeTruthy()

      //Test le le justificatif 
      expect(screen.getByTestId('file')).toBeTruthy()
    })





    describe("When I add an image file as bill proof", () => {
      test("Then this new file should have been changed in the input", () => {
        Object.defineProperty(window, 'localStorage', { 
          value: localStorageMock 
        })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const html = NewBillUI()
        document.body.innerHTML = html
  
        const newBills = new NewBill({
          document, 
          onNavigate, 
          firestore: null,  
          localStorage: window.localStorage
        })
  
        const handleChangeFile = jest.fn(newBills.handleChangeFile)
        const fileInput = screen.getByTestId('file')


        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, { 
          target: { 
            files: [new File(['bill.png'], 'bill.png', {type: 'image/png'})]
          } 
        })
  
        expect(handleChangeFile).toHaveBeenCalled()
        expect(fileInput.files[0].name).toBe('bill.png')
      })
    })



    describe("When I add an non-image file as bill proof", () => {
      test("Then throw an alert", () => {
        Object.defineProperty(window, 'localStorage', { 
          value: localStorageMock 
        })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const html = NewBillUI()
        document.body.innerHTML = html
  
        const newBills = new NewBill({
          document, 
          onNavigate, 
          firestore: null,  
          localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn(newBills.handleChangeFile)
        const fileInput = screen.getByTestId('file')
  
        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, { 
          target: { 
            files: [new File(['video.mp4'], 'video.mp4', {type: 'video/mp4'})]
          } 
        })
  
        expect(handleChangeFile).toHaveBeenCalled()
        expect(window.alert).toHaveBeenCalled()
      })
    })




    describe("When I Submit form", () => {
      test("Then, I should be sent on Bills page", () => {
        Object.defineProperty(window, 'localStorage', { 
          value: localStorageMock 
        })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const html = NewBillUI()
        document.body.innerHTML = html

        const newBills = new NewBill({
          document, 
          onNavigate, 
          firestore: null, 
          localStorage: window.localStorage
        })

        const handleSubmit = jest.fn(newBills.handleSubmit)
        const newBillForm = screen.getByTestId('form-new-bill')
        newBillForm.addEventListener("submit", handleSubmit)

        fireEvent.submit(newBillForm)

        expect(handleSubmit).toHaveBeenCalled()
        expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
      })
    })   
  })
})





// test d'intégration POST
describe("Given I am a user connected as employee", () => {
  describe("When I send a new Bill", () => {
    test("fetches bills from mock API POST", async () => {
      const getSpy = jest.spyOn(firebase, "post")

      const newBill = {
        "id": "qcCK3SzECmaZAGReggyrgy",
         "status": "refused",
         "pct": 20,
         "amount": 200,
         "email": "a@a",
         "name": "test33",
         "vat": "40",
         "fileName": "preview-facture-free-201801-pdf-1.jpg",
         "date": "2002-02-02",
         "commentAdmin": "pas la bonne facture",
         "commentary": "test2",
         "type": "Restaurants et bars",
         "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
       };

      const bills = await firebase.post(newBill)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})



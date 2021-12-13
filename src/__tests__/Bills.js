import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import Bills  from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Router from "../app/Router"
import { ROUTES, ROUTES_PATH} from "../constants/routes"
import firebase from "../__mocks__/firebase"
import Firestore from "../app/Firestore"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    
    
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html

      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() })

      
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({type: "Employee"}));

      
      const pathname = ROUTES_PATH["Bills"] // return '#employee/bills'
      Object.defineProperty(window, "location", { value: { hash: pathname } })
      
      document.body.innerHTML = `<div id="root"></div>`
      Router()

      expect(screen.getByTestId("icon-window").classList.contains("active-icon")).toBe(true)
    })


    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I am on bills page but it is loading",()=>{
    test("Then,loading page should be rendered",()=>{
      const html = BillsUI({loading:true})
      document.body.innerHTML = html

      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })


  describe('When I am on bills page but back-end send a error message',()=>{
    test('then,error page should be rendered',()=>{
      const html = BillsUI({error:'some error message'})
      document.body.innerHTML = html

      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })




  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }


  describe("When I click on the icon eye of a bill", () => {
    test("Then a modal should open", () => {
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      
      const firestore = null
      const bill = new Bills({ document, onNavigate, firestore, localStorage: window.localstorage })

      $.fn.modal = jest.fn()
      const eyeIcon = screen.getAllByTestId("icon-eye")[0]
      const handleClickIconEye = jest.fn((e) => {
        e.preventDefault()
        bill.handleClickIconEye(eyeIcon)
      })
      eyeIcon.addEventListener("click", handleClickIconEye)
      fireEvent.click(eyeIcon)
      expect(handleClickIconEye).toHaveBeenCalled()
    })
  })

  describe('When I click on the Make New Bill button', () => {
    test('A new bill modal should open', () => {
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({data: []})
      document.body.innerHTML = html
      
      const firestore = null
      const bill = new Bills({ document, onNavigate, firestore, localStorage: window.localstorage })

      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const newBillIcon = screen.getByTestId('btn-new-bill')
      newBillIcon.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillIcon)
      expect(handleClickNewBill).toHaveBeenCalled()

      const modal = screen.getByTestId('form-new-bill')
      expect(modal).toBeTruthy()
    })
  })
})


// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate an bills page", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
 /* istanbul ignore next */

 





  

    

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


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

    
  })
})


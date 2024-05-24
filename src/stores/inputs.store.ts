import Alpine from "alpinejs";

document.addEventListener('alpine:init', () => {
  Alpine.store('inputs', {
    tobaud_only(event) {
      const regex = new RegExp("^[a-z0-4\ ]$")
      const key = String.fromCharCode(!event.charCode ? event.which : event.charCode)
  
      if (!regex.test(key)) {
        event.preventDefault()
        return false
      }
    },
    binary_only(event) {
      const regex = new RegExp("^[01]$")
      const key = String.fromCharCode(!event.charCode ? event.which : event.charCode)
  
      if (!regex.test(key)) {
        event.preventDefault()
        return false
      }
    }
  })
})

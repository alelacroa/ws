const form = document.getElementById("formulario");
const spinner = document.getElementById('spinner');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

spinner.style.display = 'block';

  const formData = new FormData(event.target);
  const data = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    carrera: formData.get("carrera"),
  };

  const response = await fetch("https://server-v7k4.onrender.com/back", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    
  });
  console.log(data)
  
if (response.ok) {
    window.location.href = "agradecimiento.html";
    
  } else {
    alert("Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.");
  }
});


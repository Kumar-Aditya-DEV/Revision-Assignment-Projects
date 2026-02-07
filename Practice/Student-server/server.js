// const express = require("express");
// const app = express();

// const students = [
//   {
//     studentName: "ABDUL HAQUE",
//     University: "SUxCG 714",
//     UniversityUID: "108444"
//   },
//   {
//     studentName: "ADITYA KUMAR",
//     University: "SUxCG 702",
//     UniversityUID: "108716"
//   },
//   {
//     studentName: "AMAN KUMAR",
//     University: "SUxCG 702",
//     UniversityUID: "108500"
//   },
//   {
//     studentName: "AMRIT RAJ",
//     University: "SUxCG 702",
//     UniversityUID: "108587"
//   },
//   {
//     additional_info :"For specific student details write after /cg/your gr no."
//   }
// ];


// app.get("/cg/students", (req, res) => {
//   res.json(students);
// });


// app.get("/cg/students/:gr_number", (req, res) => {
//   const grNumber = req.params.gr_number;
//   const student = students.find((s) => s.UniversityUID === grNumber);

//   if (student) {
//     res.json({
//       name: student.studentName,
//       id: student.UniversityUID,
//       University: student.University
//     });
//   } else {
//     res.status(404).json({ message: "Student not found" });
//   }
// });



// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });
















const express = require("express");
const app = express();

const students = [
  {
    studentName: "ABDUL HAQUE",
    University: "SUxCG 714",
    UniversityUID: "108444"
  },
  {
    studentName: "ADITYA KUMAR",
    University: "SUxCG 702",
    UniversityUID: "108716"
  },
  {
    studentName: "AMAN KUMAR",
    University: "SUxCG 702",
    UniversityUID: "108500"
  },
  {
    studentName: "AMRIT RAJ",
    University: "SUxCG 702",
    UniversityUID: "108587"
  }
];

app.get("/cg/students", (req, res) => {
  res.json(students);
});

app.get("/cg/students/:gr_number", (req, res) => {
  const grNumber = req.params.gr_number;

  const student = students.find(
    (s) => s.UniversityUID === grNumber
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // 🔥 YE MISSING THA
  res.json({
    name: student.studentName,
    id: student.UniversityUID,
    University: student.University
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

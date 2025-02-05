export type NivoLineSerie = {
  id: string;
  color: string;
  data: {
    x: Date;
    y: number | null;
  }[];
  id_widget: number;
};

// Réfférence
// const data = [
//   {
//     id: "Frequence rouille",
//     color: "#70d670",
//     data: [
//       {
//         x: new Date("2025-01-19T18:57:45.773Z"),
//         y: 34,
//       },
//       {
//         x: new Date("2025-01-23T18:48:04.384Z"),
//         y: 37,
//       },
//     ],
//   },
// ];

# Personal Finance Visualizer

A modern personal finance tracking application built with Next.js, MongoDB, Zustand, and shadcn/ui. Track your income, expenses, budgets, and get insights into your financial habits.

🔗 **Live Demo**: [https://finance-visualize.vercel.app](https://finance-visualize.vercel.app)

## ✨ Features

- **Transaction Management**: Add, edit, delete transactions with income/expense filtering and color-coding
- **Data Visualization**: Interactive charts for monthly trends, category breakdowns, and budget comparisons
- **Smart Budget Management**: Create budgets, track progress, and receive overspending alerts
- **Financial Insights**: Spending pattern analysis, budget tracking, and financial health monitoring
- **Modern UI**: Dark/light mode, responsive design, and smooth animations
- **Data Security**: MongoDB integration with secure API endpoints and data validation

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **Zustand** - State management
- **MongoDB** - Database
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local`:

   ```env
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   # OR MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for better financial management**

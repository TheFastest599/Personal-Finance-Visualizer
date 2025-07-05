# Personal Finance Visualizer

A modern, beautiful personal finance tracking application built with Next.js, React, and Tailwind CSS. Track your income, expenses, budgets, and get insights into your financial habits with interactive charts and visualizations.

## Features

✨ **Transaction Management**

- Add, edit, and delete transactions
- Categorize income and expenses
- View detailed transaction history

📊 **Data Visualization**

- Monthly expenses trend charts
- Category-wise spending pie charts
- Budget vs actual comparison charts
- Interactive dashboard with key metrics

💰 **Budget Management**

- Set monthly budgets by category
- Track budget progress with visual indicators
- Get alerts when approaching budget limits

🔍 **Financial Insights**

- Smart spending insights and recommendations
- Identify top spending categories
- Track financial health metrics

🎨 **Modern UI/UX**

- Clean, responsive design
- Dark mode support
- Beautiful charts powered by Recharts
- Accessible components using shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Storage**: LocalStorage (with MongoDB integration ready)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd personal-finance-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── transactions/      # Transactions management
│   ├── analytics/         # Financial analytics
│   ├── budgets/          # Budget management
│   └── layout.js         # Root layout with context providers
├── components/           # Reusable React components
│   ├── ui/              # shadcn/ui base components
│   ├── Navigation.jsx   # App navigation
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── DashboardSummary.jsx
│   ├── MonthlyExpensesChart.jsx
│   ├── CategoryPieChart.jsx
│   ├── BudgetManager.jsx
│   └── SpendingInsights.jsx
├── contexts/            # React context providers
│   └── DataContext.jsx  # App state management
└── lib/
    └── utils.js         # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Dashboard

- Overview of financial health
- Key metrics and summaries
- Recent transactions
- Monthly spending trends

### Transactions

- Add new income/expense transactions
- Edit existing transactions
- Filter and search transactions
- Category-based organization

### Analytics

- Detailed spending insights
- Monthly expense trends
- Category breakdowns
- Financial health metrics

### Budget Management

- Set monthly budgets by category
- Visual progress tracking
- Budget vs actual comparisons
- Overspending alerts

## Customization

The app uses a clean design system that can be easily customized:

- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Components**: All UI components are in `src/components/ui/`
- **Categories**: Update transaction categories in `src/contexts/DataContext.jsx`
- **Charts**: Customize chart styles in individual chart components

## Data Storage

Currently uses browser LocalStorage for data persistence. The app is designed to easily integrate with MongoDB or other databases by updating the DataContext.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)

# Spanish Learning Tools - HKU 🎓

An interactive collection of educational tools for Spanish language learning from the Spanish Department, SMLC, University of Hong Kong.

## 🌟 Features

- **Bilingual interface** (Spanish/English) with dynamic switching
- **Two view modes**: Detailed cards and compact grid
- **Advanced filtering system** by subject, level, and type
- **Multiple sorting options** by alphabetical, date, rating, and popularity
- **Real-time search** by title and description
- **Responsive design** optimized for mobile and tablets
- **Interactive title** with 3D effects and hover animations
- **HKU color theme** following university visual identity

## 🎨 Design

- **Google Fonts typography**: 
  - `Jua` for main title
  - `Zain` for general text
- **HKU institutional colors**:
  - Green: `#008c45` (active elements)
  - Red: `#c8102e` (titles and hover)
  - Gold: `#cc7a00` (education levels)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/spanish-learning-tools-hku.git
```

2. Open `index.html` in your browser or deploy to GitHub Pages.

## 📁 File Structure

```
spanish-learning-tools-hku/
├── index.html          # Main structure
├── styles.css          # Styles and design
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## 🛠️ Adding New Tools

To add a new tool, edit the `tools` array in `script.js`:

```javascript
{
    id: 8,
    title: "Tool Name",
    description: "Detailed description...",
    link: "https://link-to-tool.com",
    subjects: ["Subject1", "Subject2"],
    level: "A1", // A1, A2, B1, B2, or "All levels"
    type: "Game", // Game, Exercise, or Resource
    dateAdded: "2024-MM-DD",
    rating: 4.5, // 1.0 to 5.0
    usageCount: 0
}
```

## 🌐 GitHub Pages Deployment

1. Go to your repository settings
2. Navigate to **Pages** in the sidebar
3. Select **Deploy from a branch**
4. Choose **main** as branch and **/ (root)** as folder
5. Save changes

Your site will be available at: `https://your-username.github.io/spanish-learning-tools-hku`

## 🎯 Functionality

### Search and Filters
- **Search bar**: Search by title or description
- **Subject filter**: SPAN1001, SPAN2001, General, Grammar, Vocabulary
- **Level filter**: A1, A2, B1, B2, All levels
- **Type filter**: Game, Exercise, Resource

### View Modes
- **Card View**: Complete and detailed information
- **Grid View**: Compact for quick overview

### Sorting
- **Alphabetical**: By tool name
- **Date**: By addition date (newest first)
- **Rating**: By score (highest first)
- **Popularity**: By usage count

## 🎭 Interactive Effects

- **Animated title**: Each word rotates 360° with golden light effects
- **Hover effects**: Cards with elevation and border color change
- **Smooth transitions**: In filters, sorting, and view switching
- **Animated language change**: Word rotation when switching languages

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-tool`)
3. Commit your changes (`git commit -m 'Add new tool'`)
4. Push to the branch (`git push origin feature/new-tool`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for more details.

## 👥 Credits

Developed for the **Spanish Department, SMLC, University of Hong Kong**

---

**Have suggestions or found a bug?** Open an [issue](https://github.com/your-username/spanish-learning-tools-hku/issues) or contact the department.

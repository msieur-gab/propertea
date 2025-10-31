# Asian Tea Dataset Analysis

This folder contains a collection of premium Asian tea datasets and tools to analyze the frequency of processing methods and flavor profiles across different tea types.

## Tea Datasets

The collection includes the following tea types:
- **Green Teas**: `green_teas_asia.js`
- **White Teas**: `white_teas_asia.js`
- **Oolong Teas**: `oolong_teas_asia.js`
- **Black Teas**: `black_teas_asia.js`
- **Yellow Teas**: `yellow_teas_asia.js`
- **Dark Teas**: `dark_teas_asia.js`

Each dataset contains detailed information about 50 different teas, including:
- Tea name (English and original language)
- Region
- Processing methods
- Flavor profiles
- Descriptions

## Analysis Tools

### Viewing the Analysis in a Web Browser

The simplest way to view the tea analysis is directly in your web browser:

1. Open the `tea_analysis.html` file in your web browser
2. The page will automatically load and analyze the data from all tea types
3. The results will be displayed as formatted tables showing the frequency of processing methods and flavors

### How It Works

The analysis is built with vanilla JavaScript:

- Each tea dataset is loaded as a separate JavaScript file
- The analysis script processes the data and calculates frequencies
- The HTML page displays the results in a user-friendly format

### Customizing the Analysis

If you want to customize or extend the analysis:

1. Modify the `tea_frequency_analysis.js` file to add new analysis functions
2. Update the `tea_analysis.html` file to display the new results

## Analysis Features

The tea analysis provides:

1. **Processing Method Frequency**: Shows how often each processing method (like withering, rolling, steaming, etc.) appears in each tea type
2. **Flavor Profile Frequency**: Shows how often each flavor descriptor (like sweet, floral, malty, etc.) appears in each tea type
3. **Percentage**: Shows what percentage of teas within a type have a specific processing method or flavor

The analysis helps identify the characteristic processing methods and flavors that define each tea type.

## Example Insights

This analysis can reveal interesting patterns such as:
- Green teas commonly use methods like steaming, pan-firing, and withering
- Black teas typically involve full oxidation and rolling
- White teas often use minimal processing and natural withering
- Certain flavors like "sweet" appear across many tea types, while others are specific to certain types

## Technical Details

The analysis page uses:
- Vanilla JavaScript (no frameworks or external dependencies)
- CSS Grid for responsive layout
- Color-coding to distinguish between tea types 
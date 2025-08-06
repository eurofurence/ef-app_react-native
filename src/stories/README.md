# Storybook Stories

This directory contains Storybook stories for the Eurofurence React Native app components. The stories are organized by component type and provide interactive documentation for the design system.

## Structure

```
src/stories/
├── components/
│   ├── atoms/           # Basic atomic components
│   │   ├── Label.stories.tsx
│   │   └── Icon.stories.tsx
│   ├── containers/      # Container components
│   │   ├── Button.stories.tsx
│   │   └── Card.stories.tsx
│   ├── events/          # Event-related components
│   │   └── EventCard.stories.tsx
│   ├── announce/        # Announcement components
│   │   └── AnnouncementCard.stories.tsx
│   └── dealers/         # Dealer-related components
│       └── DealerCard.stories.tsx
├── mocks/               # Mock data for stories
│   ├── eventData.ts
│   ├── announcementData.ts
│   └── dealerData.ts
└── README.md           # This file
```

## Usage

To run Storybook:

```bash
npm run storybook
# or
yarn storybook
# or
pnpm storybook
```

## Adding New Stories

When adding new components to Storybook:

1. Create the story file in the appropriate directory under `components/`
2. Add mock data to the `mocks/` directory if needed
3. Follow the existing patterns for:
   - Meta configuration with proper title and tags
   - Decorators for consistent styling
   - ArgTypes for interactive controls
   - Multiple story variants showing different states
   - Interactive examples with action handlers

## Best Practices

- Use descriptive story names that explain the variant
- Include both simple and complex examples
- Show edge cases (long text, missing data, etc.)
- Use mock data that represents real usage
- Include interactive examples with action handlers
- Group related components in the same directory
- Use consistent decorators for similar components 
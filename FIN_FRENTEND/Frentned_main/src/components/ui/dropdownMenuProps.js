// Shared dropdown panel sizing for Select/Autocomplete MenuProps, so every
// dropdown panel across the app is at least as wide as its input and never
// grows unreasonably tall.
export const DROPDOWN_MENU_PROPS = {
  PaperProps: {
    sx: {
      minWidth: 260,
      maxHeight: 320,
    },
  },
};

/**
 * The application's icon language — one place, one icon per meaning.
 *
 * Two rules this file exists to enforce:
 *
 *  1. The same action always uses the same icon. Download is Download
 *     everywhere, Print is Print everywhere. Screens import from here rather
 *     than reaching into @mui/icons-material and picking whatever looked right
 *     that day (the app had Search, SearchRounded and SearchIcon all in use).
 *  2. Every navigation entry has its own icon. No two menu items share one, so
 *     the sidebar can be read by shape.
 *
 * The Rounded set is the house style; Settings is the one deliberate outline.
 */

import {
  // actions
  AddRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  ClearRounded,
  CloseRounded,
  ContentCopyRounded,
  DeleteRounded,
  DownloadRounded,
  EditRounded,
  ExpandMoreRounded,
  FilterListRounded,
  LogoutRounded,
  MenuRounded,
  MoreVertRounded,
  PlayArrowRounded,
  PrintRounded,
  RefreshRounded,
  SaveRounded,
  SearchRounded,
  SettingsOutlined,
  VisibilityOffRounded,
  VisibilityRounded,
  ZoomInRounded,
  ZoomOutRounded,
  // file formats
  ArticleRounded,
  DescriptionRounded,
  GridOnRounded,
  TableViewRounded,
  // navigation
  AccountBalanceRounded,
  AccountBalanceWalletRounded,
  AccountTreeRounded,
  AdminPanelSettingsRounded,
  AssessmentRounded,
  BadgeRounded,
  BalanceRounded,
  BusinessCenterRounded,
  CalculateRounded,
  CalendarMonthRounded,
  CallSplitRounded,
  ContactPageRounded,
  DashboardCustomizeRounded,
  DeleteForeverRounded,
  EventBusyRounded,
  EventRepeatRounded,
  FolderSharedRounded,
  FolderSpecialRounded,
  GroupsRounded,
  HandshakeRounded,
  ListAltRounded,
  LockPersonRounded,
  LoginRounded,
  ManageAccountsRounded,
  MenuBookRounded,
  PaidRounded,
  PaymentsRounded,
  PendingActionsRounded,
  PersonAddAlt1Rounded,
  PersonSearchRounded,
  PieChartRounded,
  PointOfSaleRounded,
  PriceCheckRounded,
  ReceiptLongRounded,
  ReceiptRounded,
  RequestPageRounded,
  RequestQuoteRounded,
  SavingsRounded,
  SpaceDashboardRounded,
  StorefrontRounded,
  SummarizeRounded,
  SwapHorizRounded,
  TaskAltRounded,
  TrendingUpRounded,
  WorkspacesRounded,
} from "@mui/icons-material";

/**
 * Actions. Use these for every button, menu item and toolbar control — a
 * screen should never import an action icon straight from MUI.
 */
export const actionIcons = {
  download: DownloadRounded,
  print: PrintRounded,
  refresh: RefreshRounded,
  search: SearchRounded,
  filter: FilterListRounded,
  settings: SettingsOutlined,

  add: AddRounded,
  edit: EditRounded,
  delete: DeleteRounded,
  save: SaveRounded,
  close: CloseRounded,
  clear: ClearRounded,
  copy: ContentCopyRounded,
  generate: PlayArrowRounded,

  view: VisibilityRounded,
  hide: VisibilityOffRounded,

  zoomIn: ZoomInRounded,
  zoomOut: ZoomOutRounded,
  scrollLeft: ChevronLeftRounded,
  scrollRight: ChevronRightRounded,
  expand: ExpandMoreRounded,
  more: MoreVertRounded,
  menu: MenuRounded,
  logout: LogoutRounded,
};

/**
 * Download formats. Every Download menu in the app lists the same four in the
 * same order with the same icons and colours.
 */
export const formatIcons = {
  excel: TableViewRounded,
  pdf: DescriptionRounded,
  word: ArticleRounded,
  csv: GridOnRounded,
};

export const formatIconColors = {
  excel: "success",
  pdf: "error",
  word: "primary",
  csv: "action",
};

/**
 * Navigation. One icon per menu entry, none repeated — `sidebarGroups` in
 * src/partials/SidebarConfig.js is built from these, and the top bar and
 * command search read the same map, so a screen is recognised by the same
 * mark wherever it appears.
 */
export const navIcons = {
  // top level
  dashboard: SpaceDashboardRounded,

  // groups
  master: FolderSharedRounded,
  transactions: SwapHorizRounded,
  accounts: AccountBalanceRounded,
  loan: RequestQuoteRounded,
  accountMaster: AdminPanelSettingsRounded,
  business: BusinessCenterRounded,
  customer: PersonSearchRounded,
  partners: HandshakeRounded,
  auth: LockPersonRounded,

  // Master Information
  personalInformation: ContactPageRounded,
  masterLoans: RequestPageRounded,

  // Transactions
  businessCashBook: MenuBookRounded,
  quickCashBook: PointOfSaleRounded,
  cashbook: AccountBalanceWalletRounded,
  deleteTransaction: DeleteForeverRounded,

  // Accounts
  loansMain: AccountTreeRounded,
  dailyBook: CalendarMonthRounded,
  cbLedger: CalculateRounded,
  accountLedger: ReceiptLongRounded,
  accountMasterLedger: FolderSpecialRounded,
  userCollectionLedger: GroupsRounded,
  receiptLedger: PaidRounded,

  // Loans
  distributedLoans: CallSplitRounded,
  instalmentDues: EventRepeatRounded,
  maturity: TaskAltRounded,

  // Account Master
  accountSetup: ManageAccountsRounded,
  userRegistration: PersonAddAlt1Rounded,

  // Business
  revenueExpenseStatement: AssessmentRounded,
  balanceSheet: BalanceRounded,
  businessOverview: DashboardCustomizeRounded,
  collectionReports: SummarizeRounded,
  businessShare: PieChartRounded,

  // Customer Reports
  customerDues: EventBusyRounded,
  customerOutstanding: PendingActionsRounded,
  customerReport: DescriptionRounded,
  customerTransactions: ReceiptRounded,

  // Partner Reports
  partnerBusinessReports: StorefrontRounded,
  groupBusinessDetails: ListAltRounded,
  groupBusiness: WorkspacesRounded,
  partnerInstallmentDues: PaymentsRounded,
  partnerLoanLimit: SavingsRounded,
  partnerSettlement: PriceCheckRounded,
  partnerInformation: BadgeRounded,
  partnerPerformance: TrendingUpRounded,

  // Authentication
  signIn: LoginRounded,
};

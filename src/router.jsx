import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Roles from "./pages/user-management/Roles";
import Users from "./pages/user-management/Users";
import ChangePassword from "./pages/user-management/ChangePassword";
import RolePermissionMapping from "./pages/user-management/RolePermissionMapping";
import MakerChecker from "./pages/maker-checker/MakerChecker";
import EnableDisable from "./pages/maker-checker/EnableDisable";
import PendingForApproval from "./pages/maker-checker/PendingForApproval";
import InstitutionMgmt from "./pages/InstitutionMgmt";
import Institution from "./pages/institution-management/Institution";
import LinkUserInstitution from "./pages/institution-management/LinkUserInstitution";
import InstitutionACSURL from "./pages/institution-management/InstitutionACSURL";
import InstitutionAccountRange from "./pages/institution-management/InstitutionAccountRange";
import AuthTypeInstrConfig from "./pages/institution-management/AuthTypeInstrConfig";
import InstrumentTxnAuthOption from "./pages/institution-management/InstrumentTxnAuthOption";
import UIConfig from "./pages/institution-management/UIConfig";
import InstrumentRenderType from "./pages/institution-management/InstrumentRenderType";
import Reports from "./pages/Reports";
import BatchConfig from "./pages/BatchConfig";

function makePage(title) {
  return function Page() {
    return (
      <div className="content-card">
        <h2>{title}</h2>
      </div>
    );
  };
}
const HSMConfig = makePage("HSM Config");
const CardManagement = makePage("Card Management");
const BlockUnblock = makePage("Block/Unblock");
const AuditReport = makePage("Audit Report");
const ApprovalReport = makePage("Approval Report");
const TransactionReport = makePage("Transaction Report");
const PageS = makePage("S");
const PageT = makePage("T");
const PageK = makePage("K");
const BatchExecution = makePage("Batch Execution");

export const pageMap = {
  Dashboard,
  "User Management": UserManagement,
  Roles,
  Users,
  "Change Password": ChangePassword,
  "Role Permission Mapping": RolePermissionMapping,
  Institution,
  "Link User Institution": LinkUserInstitution,
  "Institution ACS URL": InstitutionACSURL,
  "Institution Account Range": InstitutionAccountRange,
  "Institution Instrument": InstitutionAccountRange,
  "Auth Type Instr Config": AuthTypeInstrConfig,
  "Instrument Txn Auth Option": InstrumentTxnAuthOption,
  "UI Config": UIConfig,
  "Instrument Render Type": InstrumentRenderType,
  "HSM Config": HSMConfig,
  "Card Management": CardManagement,
  "Block/Unblock": BlockUnblock,
  "Audit Report": AuditReport,
  "Approval Report": ApprovalReport,
  "Transaction Report": TransactionReport,
  Sggg: PageS,
  T: PageT,
  K: PageK,
  "Maker Checker": MakerChecker,
  "Institution Management": InstitutionMgmt,
  Reports,
  "Batch Configuration": BatchConfig,
  "Batch Execution": BatchExecution,
  "Batch Config": BatchConfig,
  "Enable/Disable": EnableDisable,
  "Pending for Approval": PendingForApproval,
};

export function renderPage(
  activeMenu,
  transactionData,
  onNavigate,
  screenPermissions,
  session,
  selectedInstitutionId
) {
  const PageComponent = pageMap[activeMenu] || Dashboard;
  return (
    <PageComponent
      transactionData={transactionData}
      onNavigate={onNavigate}
      screenPermissions={screenPermissions}
      session={session}
      selectedInstitutionId={selectedInstitutionId}
    />
  );
}

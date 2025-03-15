import { ViewerImageRecord } from "../components/viewer/ViewerImageRecord";
import { ViewerUrl } from "../components/viewer/ViewerUrl";
import { useAppRoute } from "../hooks/nav/useAppNavigation";
import { RecordId } from "../store/eurofurence/types";

export type ViewerParams =
    | {
          id: RecordId;
      }
    | {
          url: string;
          title: string;
      };

export const Viewer = () => {
    const { params } = useAppRoute("Viewer");
    if ("url" in params) return <ViewerUrl url={params.url} title={params.title} />;
    else return <ViewerImageRecord id={params.id} />;
};

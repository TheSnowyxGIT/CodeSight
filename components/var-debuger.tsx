"use client";
import { TreeItem, TreeItemProps, treeItemClasses, TreeView } from "@mui/lab";
import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { inspect } from "util";
import EventDispatcher from "@/lib/event-dispatcher/event-dispatcher";
import { useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { useSpring, animated } from "@react-spring/web";
import Collapse from "@mui/material/Collapse";

const StyledTreeItemRoot = styled((props: TreeItemProps) => (
  <TreeItem {...props} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.3)}`,
  },
}));

function getVariableTypo(value: string | number | boolean | null | undefined) {
  if (typeof value === "string") {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#ff0000", whiteSpace: "nowrap" }}
      >
        &quot;{value}&quot;
      </Typography>
    );
  } else if (typeof value === "number") {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#00ff00", whiteSpace: "nowrap" }}
      >
        {value}
      </Typography>
    );
  } else if (typeof value === "boolean") {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#0000ff", whiteSpace: "nowrap" }}
      >
        {`${value}`}
      </Typography>
    );
  } else if (value === null) {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#fff6", whiteSpace: "nowrap" }}
      >
        null
      </Typography>
    );
  } else if (value === undefined) {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#fff6", whiteSpace: "nowrap" }}
      >
        undefined
      </Typography>
    );
  } else {
    return (
      <Typography
        variant="body2"
        color="inherit"
        sx={{ color: "#fff6", whiteSpace: "nowrap" }}
      >
        unknown
      </Typography>
    );
  }
}

type VarTerminalItemProps = TreeItemProps & {
  variableName: string;
  variableValue: string | number | boolean | null | undefined;
};
function VarTerminalItem(props: VarTerminalItemProps) {
  const { variableName, variableValue, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "inherit",
              color: "#a36f9f",
              pr: 1,
              whiteSpace: "nowrap",
            }}
          >
            {variableName}:
          </Typography>
          {getVariableTypo(variableValue)}
        </Box>
      }
      {...other}
    />
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  return <animated.div style={style}>{props.children}</animated.div>;
}

type VarNestedItemProps = TreeItemProps & {
  variableName: string;
  variableValue: object;
};
function VarNestedItem(props: VarNestedItemProps) {
  const theme = useTheme();
  const { variableName, variableValue, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "inherit",
              color: "#a36f9f",
              pr: 1,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {variableName}:
          </Typography>
          <Typography
            variant="body2"
            color="inherit"
            sx={{
              color: "#fff6",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {inspect(variableValue, false, 0)}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
}

function buildTree(
  object: Record<string, any> | Array<any>,
  currentDepth: number = 0
) {
  if (Array.isArray(object)) {
    return object.map((value, index) => {
      if (typeof value === "object" && value !== null) {
        return (
          <VarNestedItem
            key={index}
            nodeId={`${currentDepth}/${index}`}
            variableName={index.toString()}
            variableValue={value}
          >
            {buildTree(value, currentDepth + 1)}
          </VarNestedItem>
        );
      } else {
        return (
          <VarTerminalItem
            key={index}
            nodeId={`${currentDepth}/${index}`}
            variableName={index.toString()}
            variableValue={value}
          />
        );
      }
    });
  }
  return Object.keys(object).map((key) => {
    const value = object[key];
    if (typeof value === "object" && value !== null) {
      return (
        <VarNestedItem
          key={key}
          nodeId={`${currentDepth}/${key}`}
          variableName={key}
          variableValue={value}
        >
          {buildTree(value, currentDepth + 1)}
        </VarNestedItem>
      );
    } else {
      return (
        <TransitionComponent key={key}>
          <VarTerminalItem
            key={key}
            nodeId={`${currentDepth}/${key}`}
            variableName={key}
            variableValue={value}
          />
        </TransitionComponent>
      );
    }
  });
}

type VarDebuggerProps = {
  dispatcher: EventDispatcher;
};
export default function VarDebugger(props: VarDebuggerProps) {
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [previousVariables, setPreviousVariables] = useState<
    Record<string, any>
  >({});

  async function on(
    type: "blocking" | "noBlocking",
    value: any,
    payload: any
  ): Promise<any> {
    if (value === "variables") {
      const newVariables = payload as object;
      setPreviousVariables(variables);
      setVariables(newVariables);
    }
  }

  useEffect(() => {
    props.dispatcher.addSubscriber(on);
    return () => {
      props.dispatcher.removeSubscriber(on);
    };
  });

  useEffect(() => {
    setPreviousVariables(variables);
  }, [variables]);

  return (
    <TreeView
      defaultCollapseIcon={<ChevronDownIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      defaultExpanded={["1"]}
    >
      <StyledTreeItemRoot nodeId="1" label="Variables">
        {buildTree(variables)}
      </StyledTreeItemRoot>
    </TreeView>
  );
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: any
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const formattedJson = JSON.stringify(data, null, 2)

  console.log('JsonViewer rendered with expandAll:', expandAll)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleExpandAll = () => {
    console.log('toggleExpandAll called, current state:', expandAll)
    setExpandAll(!expandAll)
  }

  return (
    <Card className="relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleExpandAll}
          title={expandAll ? "Collapse all" : "Expand all"}
        >
          {expandAll ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">{expandAll ? "Collapse all" : "Expand all"}</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={copyToClipboard} title="Copy JSON">
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy JSON</span>
        </Button>
      </div>
      {copied && (
        <div className="absolute top-2 right-20 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">Copied!</div>
      )}
      <div className="p-4 overflow-auto bg-muted/50 rounded-md text-sm max-h-[500px]">
        <JsonNode data={data} name="root" isRoot expandAll={expandAll} />
      </div>
    </Card>
  )
}

interface JsonNodeProps {
  data: any
  name: string
  isRoot?: boolean
  expandAll?: boolean
}

function JsonNode({ data, name, isRoot = false, expandAll = false }: JsonNodeProps) {
  // Only root node can be expanded by default, all others start collapsed
  const [isExpanded, setIsExpanded] = useState(isRoot)

  // Update expansion state when expandAll changes
  useEffect(() => {
    // If expandAll is false, collapse all except root
    // If expandAll is true, expand all
    setIsExpanded(expandAll || isRoot)
  }, [expandAll, isRoot])

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Only allow manual toggle if expandAll is false
    if (!expandAll) {
      setIsExpanded(!isExpanded)
    }
  }

  if (data === null) {
    return <span className="text-gray-500">null</span>
  }

  if (typeof data === "boolean") {
    return <span className="text-orange-600">{data ? "true" : "false"}</span>
  }

  if (typeof data === "number") {
    return <span className="text-blue-600">{data}</span>
  }

  if (typeof data === "string") {
    return <span className="text-green-600">"{data}"</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span>[]</span>
    }

    return (
      <div>
        <div onClick={toggleExpand} className="inline-flex items-center cursor-pointer hover:bg-muted/80 rounded px-1">
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
          )}
          <span className={cn("text-purple-600", !isRoot && "mr-1")}>{isRoot ? "" : "["}</span>
          {!isExpanded && (
            <span className="text-muted-foreground text-xs">
              {data.length} {data.length === 1 ? "item" : "items"}
            </span>
          )}
          {!isExpanded && <span className="text-purple-600">]</span>}
        </div>

        {isExpanded && (
          <div className="ml-4 border-l-2 border-muted-foreground/20 pl-2">
            {data.map((item: any, index: number) => (
              <div key={index} className="my-1">
                <div className="inline-flex items-center">
                  <JsonNode data={item} name={index.toString()} expandAll={expandAll} />
                  {index < data.length - 1 && <span className="text-muted-foreground">,</span>}
                </div>
              </div>
            ))}
            <span className="text-purple-600">]</span>
          </div>
        )}
      </div>
    )
  }

  // Object
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return <span>{"{}"}</span>
  }

  return (
    <div>
      <div onClick={toggleExpand} className="inline-flex items-center cursor-pointer hover:bg-muted/80 rounded px-1">
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 mr-1 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
        )}
        <span className={cn("text-purple-600", !isRoot && "mr-1")}>{isRoot ? "" : "{"}</span>
        {!isExpanded && (
          <span className="text-muted-foreground text-xs">
            {keys.length} {keys.length === 1 ? "property" : "properties"}
          </span>
        )}
        {!isExpanded && <span className="text-purple-600">{"}"}</span>}
      </div>

      {isExpanded && (
        <div className="ml-4 border-l-2 border-muted-foreground/20 pl-2">
          {keys.map((key, index) => (
            <div key={key} className="my-1">
              <div className="inline-flex items-center">
                <span className="text-red-600">"{key}"</span>
                <span className="text-muted-foreground mr-1">: </span>
                <JsonNode data={data[key]} name={key} expandAll={expandAll} />
                {index < keys.length - 1 && <span className="text-muted-foreground">,</span>}
              </div>
            </div>
          ))}
          <span className="text-purple-600">{"}"}</span>
        </div>
      )}
    </div>
  )
}

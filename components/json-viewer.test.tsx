import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from '@jest/globals'
import { JsonViewer } from './json-viewer'

const DEBUG = false

describe('JsonViewer', () => {
    const simpleData = {
        name: "test",
        value: 42
    }

    it('renders basic data', () => {
        const { container } = render(<JsonViewer data={simpleData} />)
        if (DEBUG) screen.debug(container)

        // Check if the component renders the basic data
        const nameKey = screen.getByText('"name"')
        const nameValue = screen.getByText('"test"')
        const valueKey = screen.getByText('"value"')
        const valueValue = screen.getByText('42')

        expect(nameKey).toBeTruthy()
        expect(nameValue).toBeTruthy()
        expect(valueKey).toBeTruthy()
        expect(valueValue).toBeTruthy()
    })

    it('expands and collapses nodes', () => {
        const nestedData = {
            parent: {
                child: "value"
            }
        }

        const { container } = render(<JsonViewer data={nestedData} />)
        if (DEBUG) screen.debug(container)

        // Initially, child should not be visible
        const childInitially = screen.queryByText('"child"')
        expect(childInitially).toBeNull()

        // Find the parent node and verify its structure
        const parentKey = screen.getByText('"parent"')
        const closestDiv = parentKey.closest('div')
        const clickableNode = closestDiv?.querySelector('.cursor-pointer')

        // Verify we found the correct parent node
        expect(clickableNode).toBeTruthy()
        expect(closestDiv?.textContent).toContain('"parent"')
        expect(clickableNode?.className).toContain('cursor-pointer') // Check for the clickable class

        if (clickableNode) {
            // Click the parent node
            fireEvent.click(clickableNode)

            // Verify the click had the expected effect
            const childAfterExpand = screen.getByText('"child"')
            expect(childAfterExpand).toBeTruthy()

            // Verify the parent node's state changed (e.g., chevron direction)
            const chevronAfterExpand = clickableNode.querySelector('.lucide-chevron-down')
            expect(chevronAfterExpand).toBeTruthy()

            // Click again to collapse
            fireEvent.click(clickableNode)

            // Verify collapse effect
            const childAfterCollapse = screen.queryByText('"child"')
            expect(childAfterCollapse).toBeNull()

            // Verify the parent node's state changed back
            const chevronAfterCollapse = clickableNode.querySelector('.lucide-chevron-right')
            expect(chevronAfterCollapse).toBeTruthy()
        }
    })

    it('handles expand all button', () => {
        const nestedData = {
            parent: {
                child: "value"
            }
        }

        const { container } = render(<JsonViewer data={nestedData} />)
        if (DEBUG) screen.debug(container)

        // Initially, child should not be visible
        const childInitially = screen.queryByText('"child"')
        expect(childInitially).toBeNull()

        // Click expand all
        const expandButton = screen.getByTitle('Expand all')
        fireEvent.click(expandButton)

        // Child should be visible
        const childAfterExpand = screen.getByText('"child"')
        expect(childAfterExpand).toBeTruthy()

        // Click collapse all
        const collapseButton = screen.getByTitle('Collapse all')
        fireEvent.click(collapseButton)

        // Child should be hidden again
        const childAfterCollapse = screen.queryByText('"child"')
        expect(childAfterCollapse).toBeNull()
    })
}) 